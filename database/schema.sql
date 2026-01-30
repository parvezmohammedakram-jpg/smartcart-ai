-- ============================================
-- SmartCart AI - Database Schema
-- PostgreSQL 15+
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    phone_verified BOOLEAN DEFAULT FALSE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    password_hash VARCHAR(255), -- For admin users only
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'owner', 'staff', 'admin', 'delivery')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role) WHERE status = 'active';

-- ============================================
-- TABLE: stores
-- ============================================
CREATE TABLE stores (
    store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    store_name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    gst_number VARCHAR(15),
    fssai_license VARCHAR(20),
    logo_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    settings JSONB DEFAULT '{
        "delivery_charges": 0,
        "min_order_value": 0,
        "free_delivery_above": 500,
        "working_hours": {
            "monday": {"open": "08:00", "close": "22:00"},
            "tuesday": {"open": "08:00", "close": "22:00"},
            "wednesday": {"open": "08:00", "close": "22:00"},
            "thursday": {"open": "08:00", "close": "22:00"},
            "friday": {"open": "08:00", "close": "22:00"},
            "saturday": {"open": "08:00", "close": "22:00"},
            "sunday": {"open": "09:00", "close": "21:00"}
        }
    }'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_city ON stores(city) WHERE status = 'active';
CREATE INDEX idx_stores_pincode ON stores(pincode) WHERE status = 'active';

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    store_id UUID REFERENCES stores(store_id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    description TEXT,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_store ON categories(store_id) WHERE is_active = TRUE;
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    sku VARCHAR(100),
    barcode VARCHAR(50),
    mrp DECIMAL(10, 2),
    selling_price DECIMAL(10, 2) NOT NULL,
    cost_price DECIMAL(10, 2),
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    unit_type VARCHAR(20) NOT NULL CHECK (unit_type IN ('kg', 'gram', 'liter', 'ml', 'piece', 'dozen', 'packet')),
    min_stock_level DECIMAL(10, 2) DEFAULT 10,
    max_stock_level DECIMAL(10, 2),
    image_url VARCHAR(500),
    images JSONB DEFAULT '[]'::jsonb,
    tags TEXT[],
    gst_rate DECIMAL(5, 2) DEFAULT 0,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_store ON products(store_id) WHERE is_active = TRUE;
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name_trgm ON products USING gin(product_name gin_trgm_ops);
CREATE INDEX idx_products_tags ON products USING gin(tags);
CREATE INDEX idx_products_stock ON products(stock_quantity) WHERE is_active = TRUE;

-- ============================================
-- TABLE: stock_transactions
-- ============================================
CREATE TABLE stock_transactions (
    transaction_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'damage', 'return')),
    quantity DECIMAL(10, 2) NOT NULL,
    previous_stock DECIMAL(10, 2),
    new_stock DECIMAL(10, 2),
    notes TEXT,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stock_transactions_product ON stock_transactions(product_id);
CREATE INDEX idx_stock_transactions_date ON stock_transactions(created_at);

-- ============================================
-- TABLE: customers
-- ============================================
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    date_of_birth DATE,
    preferences JSONB DEFAULT '{}'::jsonb,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier VARCHAR(20) DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES customers(customer_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone_number);
CREATE INDEX idx_customers_user ON customers(user_id);
CREATE INDEX idx_customers_referral ON customers(referral_code);

-- ============================================
-- TABLE: addresses
-- ============================================
CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    address_type VARCHAR(20) DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_customer ON addresses(customer_id);
CREATE INDEX idx_addresses_pincode ON addresses(pincode);

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    store_id UUID NOT NULL REFERENCES stores(store_id),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packing', 'out_for_delivery', 'delivered', 'cancelled')),
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charges DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(30) CHECK (payment_method IN ('upi', 'card', 'netbanking', 'wallet', 'cod')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    delivery_address_id INTEGER REFERENCES addresses(address_id),
    delivery_slot TIMESTAMP,
    special_instructions TEXT,
    assigned_to UUID REFERENCES users(user_id), -- Delivery person
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Partition orders by month for better performance
-- ALTER TABLE orders PARTITION BY RANGE (created_at);

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    product_name VARCHAR(255) NOT NULL, -- Snapshot
    product_brand VARCHAR(100),
    quantity DECIMAL(10, 2) NOT NULL,
    unit_type VARCHAR(20) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- TABLE: payments
-- ============================================
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    gateway VARCHAR(30) NOT NULL CHECK (gateway IN ('razorpay', 'stripe', 'paytm', 'cod')),
    gateway_order_id VARCHAR(255),
    gateway_payment_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(30),
    gateway_response JSONB,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_gateway_order ON payments(gateway_order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- TABLE: notifications
-- ============================================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
    notification_type VARCHAR(30) NOT NULL CHECK (notification_type IN ('sms', 'whatsapp', 'telegram', 'email', 'push')),
    recipient VARCHAR(255) NOT NULL, -- Phone/email
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'read')),
    gateway_response JSONB,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_customer ON notifications(customer_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================
-- TABLE: otp_verifications
-- ============================================
CREATE TABLE otp_verifications (
    otp_id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_phone ON otp_verifications(phone_number);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);

-- ============================================
-- TABLE: sessions
-- ============================================
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- TABLE: loyalty_transactions
-- ============================================
CREATE TABLE loyalty_transactions (
    transaction_id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(order_id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'bonus')),
    points INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loyalty_customer ON loyalty_transactions(customer_id);
CREATE INDEX idx_loyalty_order ON loyalty_transactions(order_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'SC' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq;

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function: Update stock on order
CREATE OR REPLACE FUNCTION update_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
        -- Deduct stock for each order item
        UPDATE products p
        SET stock_quantity = stock_quantity - oi.quantity
        FROM order_items oi
        WHERE oi.order_id = NEW.order_id
        AND p.product_id = oi.product_id;
        
        -- Log stock transactions
        INSERT INTO stock_transactions (product_id, transaction_type, quantity, previous_stock, new_stock)
        SELECT 
            oi.product_id,
            'sale',
            -oi.quantity,
            p.stock_quantity + oi.quantity,
            p.stock_quantity
        FROM order_items oi
        JOIN products p ON p.product_id = oi.product_id
        WHERE oi.order_id = NEW.order_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_order_trigger AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_stock_on_order();

-- Function: Update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE customers
        SET 
            total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount,
            loyalty_points = loyalty_points + FLOOR(NEW.total_amount * 0.01) -- 1% cashback
        WHERE customer_id = NEW.customer_id;
        
        -- Log loyalty transaction
        INSERT INTO loyalty_transactions (customer_id, order_id, transaction_type, points, balance_after, description)
        SELECT 
            NEW.customer_id,
            NEW.order_id,
            'earned',
            FLOOR(NEW.total_amount * 0.01),
            c.loyalty_points,
            'Points earned from order ' || NEW.order_number
        FROM customers c
        WHERE c.customer_id = NEW.customer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_trigger AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_customer_stats();

-- ============================================
-- VIEWS
-- ============================================

-- View: Low stock products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
    p.product_id,
    p.store_id,
    s.store_name,
    p.product_name,
    p.stock_quantity,
    p.min_stock_level,
    p.unit_type,
    (p.min_stock_level - p.stock_quantity) AS shortage
FROM products p
JOIN stores s ON s.store_id = p.store_id
WHERE p.is_active = TRUE
AND p.stock_quantity < p.min_stock_level
ORDER BY shortage DESC;

-- View: Daily sales summary
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
    DATE(o.created_at) AS sale_date,
    o.store_id,
    s.store_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.total_amount) AS total_revenue,
    AVG(o.total_amount) AS avg_order_value,
    COUNT(DISTINCT o.customer_id) AS unique_customers
FROM orders o
JOIN stores s ON s.store_id = o.store_id
WHERE o.status IN ('delivered', 'out_for_delivery')
GROUP BY DATE(o.created_at), o.store_id, s.store_name
ORDER BY sale_date DESC;

-- View: Top selling products
CREATE OR REPLACE VIEW top_selling_products AS
SELECT 
    p.product_id,
    p.store_id,
    p.product_name,
    p.brand,
    COUNT(oi.order_item_id) AS order_count,
    SUM(oi.quantity) AS total_quantity_sold,
    SUM(oi.total_price) AS total_revenue
FROM products p
JOIN order_items oi ON oi.product_id = p.product_id
JOIN orders o ON o.order_id = oi.order_id
WHERE o.status = 'delivered'
AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.product_id, p.store_id, p.product_name, p.brand
ORDER BY total_revenue DESC;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert admin user
INSERT INTO users (phone_number, phone_verified, email, full_name, role, status)
VALUES ('+919999999999', TRUE, 'admin@smartcart.ai', 'Admin User', 'admin', 'active');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO smartcart_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO smartcart_app;

-- ============================================
-- END OF SCHEMA
-- ============================================
