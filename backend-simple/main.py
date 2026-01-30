"""
SmartCart AI - Simplified Backend API for Free Tier Deployment
Combines essential services into a single lightweight API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime
import anthropic

app = FastAPI(
    title="SmartCart AI - Unified API",
    description="Simplified API for free tier deployment",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Claude (optional - works without it too)
anthropic_client = None
if os.getenv("ANTHROPIC_API_KEY"):
    anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# ==================== MODELS ====================

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = "demo-user"

class ChatResponse(BaseModel):
    response: str
    intent: str
    timestamp: str

class Product(BaseModel):
    id: int
    name: str
    price: float
    unit: str
    in_stock: bool

# ==================== MOCK DATA ====================

PRODUCTS = [
    {"id": 1, "name": "Fresh Tomatoes", "price": 40, "unit": "kg", "in_stock": True},
    {"id": 2, "name": "Full Cream Milk", "price": 60, "unit": "liter", "in_stock": True},
    {"id": 3, "name": "Basmati Rice", "price": 180, "unit": "5kg", "in_stock": True},
    {"id": 4, "name": "Whole Wheat Bread", "price": 40, "unit": "piece", "in_stock": True},
    {"id": 5, "name": "Fresh Eggs", "price": 60, "unit": "dozen", "in_stock": True},
    {"id": 6, "name": "Onions", "price": 30, "unit": "kg", "in_stock": True},
    {"id": 7, "name": "Potatoes", "price": 25, "unit": "kg", "in_stock": True},
    {"id": 8, "name": "Bananas", "price": 50, "unit": "dozen", "in_stock": True},
]

# ==================== HELPER FUNCTIONS ====================

def generate_simple_response(message: str) -> dict:
    """Generate response without AI (fallback)"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['tomato', 'milk', 'rice', 'bread', 'egg']):
        items = []
        total = 0
        
        if 'tomato' in message_lower:
            items.append("• Fresh Tomatoes - 2kg (₹80)")
            total += 80
        if 'milk' in message_lower:
            items.append("• Full Cream Milk - 1L (₹60)")
            total += 60
        if 'rice' in message_lower:
            items.append("• Basmati Rice - 5kg (₹900)")
            total += 900
        if 'bread' in message_lower:
            items.append("• Whole Wheat Bread (₹40)")
            total += 40
        if 'egg' in message_lower:
            items.append("• Fresh Eggs - 1 dozen (₹60)")
            total += 60
        
        response = f"Got it! 🛒\n\n{chr(10).join(items)}\n\nTotal: ₹{total}\n\nWould you like to checkout?"
        return {"response": response, "intent": "add_to_cart"}
    
    elif any(word in message_lower for word in ['yes', 'checkout', 'confirm']):
        order_id = f"SC{datetime.now().strftime('%Y%m%d%H%M%S')}"
        response = f"✅ Order confirmed!\n\nOrder #{order_id}\nDelivery: 30-45 mins\nPayment: Cash on Delivery\n\nTrack your order anytime!"
        return {"response": response, "intent": "checkout"}
    
    elif 'track' in message_lower:
        response = "📦 Your order is being prepared!\n\nStatus: Packing\nEstimated delivery: 25 mins\nDelivery person: Rahul (⭐ 4.8)"
        return {"response": response, "intent": "track_order"}
    
    elif 'help' in message_lower:
        response = "I can help you:\n\n• Order groceries\n• Track orders\n• View products\n\nTry: 'I need 2kg tomatoes and 1L milk'"
        return {"response": response, "intent": "help"}
    
    else:
        response = "I can help you order groceries! 🛒\n\nTry:\n• 'I need 2kg tomatoes'\n• 'Add 1 liter milk'\n• 'Show products'\n\nWhat would you like?"
        return {"response": response, "intent": "greeting"}

async def generate_ai_response(message: str) -> dict:
    """Generate response using Claude AI"""
    if not anthropic_client:
        return generate_simple_response(message)
    
    try:
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            system="""You are a helpful grocery shopping assistant. Help users order groceries naturally.
            Available products: tomatoes (₹40/kg), milk (₹60/L), rice (₹180/5kg), bread (₹40), eggs (₹60/dozen).
            Be friendly and concise. Format responses clearly.""",
            messages=[{"role": "user", "content": message}]
        )
        
        ai_response = response.content[0].text
        
        # Determine intent
        message_lower = message.lower()
        if any(word in message_lower for word in ['need', 'want', 'buy']):
            intent = "add_to_cart"
        elif any(word in message_lower for word in ['checkout', 'confirm']):
            intent = "checkout"
        elif 'track' in message_lower:
            intent = "track_order"
        else:
            intent = "help"
        
        return {"response": ai_response, "intent": intent}
    
    except Exception as e:
        print(f"AI Error: {e}")
        return generate_simple_response(message)

# ==================== API ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "service": "SmartCart AI - Unified API",
        "status": "healthy",
        "version": "1.0.0",
        "ai_enabled": anthropic_client is not None,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "ai": "enabled" if anthropic_client else "disabled (using fallback)",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """
    Process chat message and return AI response
    """
    try:
        result = await generate_ai_response(message.message)
        
        return ChatResponse(
            response=result["response"],
            intent=result["intent"],
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products", response_model=List[Product])
async def get_products(search: Optional[str] = None):
    """
    Get list of products
    """
    if search:
        search_lower = search.lower()
        filtered = [p for p in PRODUCTS if search_lower in p["name"].lower()]
        return filtered
    return PRODUCTS

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """
    Get single product by ID
    """
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# ==================== RUN SERVER ====================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
