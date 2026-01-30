/**
 * SmartCart AI - Product Service
 * Handles product catalog, inventory, and stock management
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import postgres from '@fastify/postgres';
import redis from '@fastify/redis';
import { z } from 'zod';

const fastify = Fastify({
  logger: true,
});

// ==================== MIDDLEWARE ====================

// CORS
await fastify.register(cors, {
  origin: true,
});

// PostgreSQL
await fastify.register(postgres, {
  connectionString: process.env.DATABASE_URL,
});

// Redis
await fastify.register(redis, {
  url: process.env.REDIS_URL,
});

// ==================== SCHEMAS ====================

const ProductSchema = z.object({
  store_id: z.string().uuid(),
  category_id: z.number().int().optional(),
  product_name: z.string().min(1).max(255),
  description: z.string().optional(),
  brand: z.string().max(100).optional(),
  sku: z.string().max(100).optional(),
  mrp: z.number().positive().optional(),
  selling_price: z.number().positive(),
  stock_quantity: z.number().nonnegative().default(0),
  unit_type: z.enum(['kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'packet']),
  min_stock_level: z.number().nonnegative().default(10),
  image_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  gst_rate: z.number().min(0).max(100).default(0),
});

const StockUpdateSchema = z.object({
  quantity: z.number(),
  transaction_type: z.enum(['purchase', 'sale', 'adjustment', 'damage', 'return']),
  notes: z.string().optional(),
});

// ==================== HELPER FUNCTIONS ====================

async function getCachedProduct(productId: number) {
  const cached = await fastify.redis.get(`product:${productId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}

async function setCachedProduct(productId: number, product: any) {
  await fastify.redis.setex(
    `product:${productId}`,
    3600, // 1 hour
    JSON.stringify(product)
  );
}

async function invalidateProductCache(productId: number) {
  await fastify.redis.del(`product:${productId}`);
}

// ==================== ROUTES ====================

// Health check
fastify.get('/', async (request, reply) => {
  return {
    service: 'SmartCart Product Service',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };
});

fastify.get('/health', async (request, reply) => {
  const health = {
    status: 'healthy',
    database: 'unknown',
    redis: 'unknown',
  };

  // Check database
  try {
    await fastify.pg.query('SELECT 1');
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'unhealthy';
  }

  // Check Redis
  try {
    await fastify.redis.ping();
    health.redis = 'connected';
  } catch (error) {
    health.redis = 'disconnected';
    health.status = 'degraded';
  }

  return health;
});

// ==================== PRODUCT CRUD ====================

// List products
fastify.get('/products', async (request, reply) => {
  const {
    store_id,
    category_id,
    search,
    in_stock,
    page = 1,
    limit = 20,
  } = request.query as any;

  if (!store_id) {
    return reply.code(400).send({
      success: false,
      error: { message: 'store_id is required' },
    });
  }

  const offset = (page - 1) * limit;
  let query = `
    SELECT 
      product_id, store_id, category_id, product_name, description,
      brand, mrp, selling_price, discount_percent, stock_quantity,
      unit_type, image_url, is_active, created_at
    FROM products
    WHERE store_id = $1 AND is_active = TRUE
  `;
  const params: any[] = [store_id];
  let paramIndex = 2;

  if (category_id) {
    query += ` AND category_id = $${paramIndex}`;
    params.push(category_id);
    paramIndex++;
  }

  if (search) {
    query += ` AND (product_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (in_stock === 'true') {
    query += ` AND stock_quantity > 0`;
  }

  query += ` ORDER BY product_name LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  try {
    const result = await fastify.pg.query(query, params);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM products 
      WHERE store_id = $1 AND is_active = TRUE
    `;
    const countResult = await fastify.pg.query(countQuery, [store_id]);
    const total = parseInt(countResult.rows[0].count);

    return {
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// Get product by ID
fastify.get('/products/:id', async (request, reply) => {
  const { id } = request.params as any;

  // Check cache first
  const cached = await getCachedProduct(id);
  if (cached) {
    return { success: true, data: cached, cached: true };
  }

  try {
    const result = await fastify.pg.query(
      `SELECT * FROM products WHERE product_id = $1 AND is_active = TRUE`,
      [id]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        success: false,
        error: { message: 'Product not found' },
      });
    }

    const product = result.rows[0];
    await setCachedProduct(id, product);

    return { success: true, data: product };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// Create product
fastify.post('/products', async (request, reply) => {
  try {
    const productData = ProductSchema.parse(request.body);

    const result = await fastify.pg.query(
      `INSERT INTO products (
        store_id, category_id, product_name, description, brand, sku,
        mrp, selling_price, stock_quantity, unit_type, min_stock_level,
        image_url, tags, gst_rate
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        productData.store_id,
        productData.category_id || null,
        productData.product_name,
        productData.description || null,
        productData.brand || null,
        productData.sku || null,
        productData.mrp || null,
        productData.selling_price,
        productData.stock_quantity,
        productData.unit_type,
        productData.min_stock_level,
        productData.image_url || null,
        productData.tags || [],
        productData.gst_rate,
      ]
    );

    return reply.code(201).send({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        success: false,
        error: { message: 'Validation error', details: error.errors },
      });
    }
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// Update product
fastify.put('/products/:id', async (request, reply) => {
  const { id } = request.params as any;

  try {
    const productData = ProductSchema.partial().parse(request.body);

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      return reply.code(400).send({
        success: false,
        error: { message: 'No fields to update' },
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE products 
      SET ${updates.join(', ')}
      WHERE product_id = $${paramIndex} AND is_active = TRUE
      RETURNING *
    `;

    const result = await fastify.pg.query(query, values);

    if (result.rows.length === 0) {
      return reply.code(404).send({
        success: false,
        error: { message: 'Product not found' },
      });
    }

    // Invalidate cache
    await invalidateProductCache(id);

    return { success: true, data: result.rows[0] };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// Delete product (soft delete)
fastify.delete('/products/:id', async (request, reply) => {
  const { id } = request.params as any;

  try {
    const result = await fastify.pg.query(
      `UPDATE products SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
       WHERE product_id = $1 RETURNING product_id`,
      [id]
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({
        success: false,
        error: { message: 'Product not found' },
      });
    }

    await invalidateProductCache(id);

    return { success: true, message: 'Product deleted' };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// ==================== STOCK MANAGEMENT ====================

// Update stock
fastify.post('/products/:id/stock', async (request, reply) => {
  const { id } = request.params as any;

  try {
    const stockData = StockUpdateSchema.parse(request.body);

    const client = await fastify.pg.connect();

    try {
      await client.query('BEGIN');

      // Get current stock
      const productResult = await client.query(
        'SELECT stock_quantity FROM products WHERE product_id = $1 FOR UPDATE',
        [id]
      );

      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.code(404).send({
          success: false,
          error: { message: 'Product not found' },
        });
      }

      const currentStock = parseFloat(productResult.rows[0].stock_quantity);
      const newStock = currentStock + stockData.quantity;

      if (newStock < 0) {
        await client.query('ROLLBACK');
        return reply.code(400).send({
          success: false,
          error: { message: 'Insufficient stock' },
        });
      }

      // Update stock
      await client.query(
        'UPDATE products SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE product_id = $2',
        [newStock, id]
      );

      // Log transaction
      const transactionResult = await client.query(
        `INSERT INTO stock_transactions 
         (product_id, transaction_type, quantity, previous_stock, new_stock, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING transaction_id`,
        [id, stockData.transaction_type, stockData.quantity, currentStock, newStock, stockData.notes || null]
      );

      await client.query('COMMIT');

      await invalidateProductCache(id);

      return {
        success: true,
        data: {
          product_id: parseInt(id),
          previous_stock: currentStock,
          new_stock: newStock,
          transaction_id: transactionResult.rows[0].transaction_id,
        },
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        success: false,
        error: { message: 'Validation error', details: error.errors },
      });
    }
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// Get low stock products
fastify.get('/products/low-stock', async (request, reply) => {
  const { store_id } = request.query as any;

  if (!store_id) {
    return reply.code(400).send({
      success: false,
      error: { message: 'store_id is required' },
    });
  }

  try {
    const result = await fastify.pg.query(
      `SELECT * FROM low_stock_products WHERE store_id = $1 ORDER BY shortage DESC`,
      [store_id]
    );

    return { success: true, data: result.rows };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// ==================== SEARCH ====================

// Search products
fastify.get('/products/search', async (request, reply) => {
  const { q, store_id } = request.query as any;

  if (!q || !store_id) {
    return reply.code(400).send({
      success: false,
      error: { message: 'q and store_id are required' },
    });
  }

  try {
    const result = await fastify.pg.query(
      `SELECT 
        product_id, product_name, brand, selling_price, stock_quantity, unit_type, image_url,
        similarity(product_name, $1) AS rank
      FROM products
      WHERE store_id = $2 
        AND is_active = TRUE
        AND (product_name ILIKE $3 OR description ILIKE $3)
      ORDER BY rank DESC, product_name
      LIMIT 20`,
      [q, store_id, `%${q}%`]
    );

    return {
      success: true,
      data: result.rows,
      total: result.rows.length,
    };
  } catch (error) {
    fastify.log.error(error);
    return reply.code(500).send({
      success: false,
      error: { message: 'Database error' },
    });
  }
});

// ==================== START SERVER ====================

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8002');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Product Service running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
