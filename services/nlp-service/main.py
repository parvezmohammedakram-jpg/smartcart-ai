"""
SmartCart AI - NLP Service
Natural Language Processing service for conversational ordering
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import anthropic
import os
import redis
import json
from datetime import datetime
import spacy

# Initialize FastAPI app
app = FastAPI(
    title="SmartCart AI - NLP Service",
    description="Natural Language Processing for conversational grocery ordering",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

# Load spaCy model for basic NLP
try:
    nlp = spacy.load("en_core_web_sm")
except:
    print("Warning: spaCy model not loaded. Install with: python -m spacy download en_core_web_sm")
    nlp = None

# ==================== MODELS ====================

class Entity(BaseModel):
    """Extracted entity from user message"""
    product: str
    quantity: Optional[float] = None
    unit: Optional[str] = None
    confidence: float = Field(ge=0.0, le=1.0)

class ParseRequest(BaseModel):
    """Request to parse natural language message"""
    message: str = Field(..., min_length=1, max_length=1000)
    user_id: str
    context: Optional[Dict[str, Any]] = None
    language: str = "en"  # en, hi (Hindi)

class ParseResponse(BaseModel):
    """Response from NLP parsing"""
    intent: str
    entities: List[Entity]
    confidence: float
    suggested_response: str
    context: Optional[Dict[str, Any]] = None

class GenerateRequest(BaseModel):
    """Request to generate AI response"""
    user_message: str
    context: Optional[Dict[str, Any]] = None
    user_id: str

class GenerateResponse(BaseModel):
    """AI-generated response"""
    response: str
    intent: str
    requires_action: bool
    action_type: Optional[str] = None

# ==================== INTENT CLASSIFICATION ====================

INTENT_PATTERNS = {
    "add_to_cart": ["need", "want", "buy", "get", "add", "order"],
    "view_cart": ["cart", "basket", "show cart", "what's in", "my order"],
    "checkout": ["checkout", "pay", "complete", "finish", "confirm order"],
    "track_order": ["track", "where is", "status", "delivery"],
    "search_product": ["search", "find", "looking for", "do you have"],
    "help": ["help", "how", "what can", "commands"],
    "greeting": ["hi", "hello", "hey", "good morning"],
    "remove_from_cart": ["remove", "delete", "cancel item"],
}

def classify_intent(message: str) -> tuple[str, float]:
    """
    Classify user intent from message
    Returns: (intent, confidence)
    """
    message_lower = message.lower()
    
    # Check for exact pattern matches
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if pattern in message_lower:
                return intent, 0.9
    
    # Default to search if contains product-like words
    if nlp:
        doc = nlp(message)
        if any(token.pos_ == "NOUN" for token in doc):
            return "search_product", 0.7
    
    return "help", 0.5

# ==================== ENTITY EXTRACTION ====================

UNIT_MAPPINGS = {
    "kg": ["kg", "kilo", "kilogram"],
    "gram": ["g", "gram", "grams", "gm"],
    "liter": ["l", "liter", "litre", "lt"],
    "ml": ["ml", "milliliter", "millilitre"],
    "piece": ["piece", "pieces", "pc", "pcs"],
    "dozen": ["dozen"],
    "packet": ["packet", "pack", "pkt"],
}

def extract_entities(message: str) -> List[Entity]:
    """
    Extract product entities from message
    Uses basic pattern matching and spaCy NER
    """
    entities = []
    
    if not nlp:
        return entities
    
    doc = nlp(message)
    
    # Extract quantities and units
    quantities = []
    for token in doc:
        if token.like_num:
            quantities.append(float(token.text))
    
    # Extract product names (nouns)
    products = []
    for chunk in doc.noun_chunks:
        products.append(chunk.text)
    
    # Match quantities with products
    for i, product in enumerate(products):
        quantity = quantities[i] if i < len(quantities) else 1.0
        
        # Detect unit
        unit = "piece"
        for unit_name, unit_patterns in UNIT_MAPPINGS.items():
            if any(pattern in message.lower() for pattern in unit_patterns):
                unit = unit_name
                break
        
        entities.append(Entity(
            product=product,
            quantity=quantity,
            unit=unit,
            confidence=0.8
        ))
    
    return entities

# ==================== CLAUDE AI INTEGRATION ====================

async def call_claude_ai(message: str, context: Optional[Dict] = None) -> Dict:
    """
    Call Anthropic Claude API for advanced NLP
    """
    system_prompt = """You are an AI assistant for SmartCart, a grocery ordering platform.
    
Your role:
- Help customers find and order groceries via natural conversation
- Extract product names, quantities, and units from messages
- Be friendly, concise, and helpful
- Support both English and Hindi

When user mentions products:
1. Identify product name
2. Extract quantity and unit
3. Confirm understanding
4. Suggest related items if appropriate

Output format (JSON):
{
    "intent": "add_to_cart|view_cart|checkout|track_order|help",
    "entities": [{"product": "name", "quantity": 2, "unit": "kg"}],
    "response": "Your friendly response",
    "confidence": 0.95
}
"""
    
    try:
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"User message: {message}\n\nContext: {json.dumps(context) if context else 'None'}"
                }
            ]
        )
        
        # Parse Claude's response
        content = response.content[0].text
        
        # Try to extract JSON from response
        try:
            result = json.loads(content)
        except:
            # Fallback to basic parsing
            result = {
                "intent": "help",
                "entities": [],
                "response": content,
                "confidence": 0.7
            }
        
        return result
        
    except Exception as e:
        print(f"Claude API error: {e}")
        raise HTTPException(status_code=500, detail="AI service unavailable")

# ==================== API ENDPOINTS ====================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "SmartCart NLP Service",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    health = {
        "status": "healthy",
        "redis": "unknown",
        "claude_api": "unknown",
        "spacy": "loaded" if nlp else "not_loaded"
    }
    
    # Check Redis
    try:
        redis_client.ping()
        health["redis"] = "connected"
    except:
        health["redis"] = "disconnected"
        health["status"] = "degraded"
    
    # Check Claude API
    try:
        if os.getenv("ANTHROPIC_API_KEY"):
            health["claude_api"] = "configured"
        else:
            health["claude_api"] = "not_configured"
            health["status"] = "degraded"
    except:
        health["claude_api"] = "error"
    
    return health

@app.post("/nlp/parse", response_model=ParseResponse)
async def parse_message(request: ParseRequest):
    """
    Parse natural language message and extract intent + entities
    
    This is the main endpoint for processing user messages.
    """
    try:
        # Use Claude AI for advanced parsing
        if os.getenv("ANTHROPIC_API_KEY"):
            result = await call_claude_ai(request.message, request.context)
            
            return ParseResponse(
                intent=result.get("intent", "help"),
                entities=[Entity(**e) for e in result.get("entities", [])],
                confidence=result.get("confidence", 0.8),
                suggested_response=result.get("response", "How can I help you?"),
                context=request.context
            )
        
        # Fallback to basic NLP
        else:
            intent, confidence = classify_intent(request.message)
            entities = extract_entities(request.message)
            
            # Generate basic response
            if intent == "add_to_cart" and entities:
                products = ", ".join([e.product for e in entities])
                response = f"Got it! Adding {products} to your cart."
            elif intent == "view_cart":
                response = "Here's what's in your cart..."
            elif intent == "greeting":
                response = "Hello! Welcome to SmartCart. How can I help you today?"
            else:
                response = "I'm here to help you order groceries. What would you like?"
            
            return ParseResponse(
                intent=intent,
                entities=entities,
                confidence=confidence,
                suggested_response=response,
                context=request.context
            )
            
    except Exception as e:
        print(f"Parse error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/nlp/generate", response_model=GenerateResponse)
async def generate_response(request: GenerateRequest):
    """
    Generate AI response for user message
    """
    try:
        result = await call_claude_ai(request.user_message, request.context)
        
        return GenerateResponse(
            response=result.get("response", "I'm here to help!"),
            intent=result.get("intent", "help"),
            requires_action=result.get("intent") in ["add_to_cart", "checkout", "track_order"],
            action_type=result.get("intent") if result.get("intent") != "help" else None
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== CONTEXT MANAGEMENT ====================

@app.post("/nlp/context/{user_id}")
async def save_context(user_id: str, context: Dict[str, Any]):
    """Save conversation context to Redis"""
    try:
        redis_client.setex(
            f"context:{user_id}",
            3600,  # 1 hour expiry
            json.dumps(context)
        )
        return {"success": True, "message": "Context saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/nlp/context/{user_id}")
async def get_context(user_id: str):
    """Retrieve conversation context from Redis"""
    try:
        context_data = redis_client.get(f"context:{user_id}")
        if context_data:
            return json.loads(context_data)
        return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== RUN SERVER ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        reload=True
    )
