from fastapi import FastAPI, HTTPException, Depends
from firebase_admin import auth, credentials, initialize_app
from pydantic import BaseModel
from typing import List
import uvicorn

# Initialize Firebase Admin SDK
cred = credentials.Certificate("path/to/your-firebase-adminsdk.json")
initialize_app(cred)

app = FastAPI()

# Define Models
class User(BaseModel):
    email: str
    password: str

class Product(BaseModel):
    name: str
    description: str
    price: float
    category: str

# Mock Database
products_db = []

# User Authentication
@app.post("/register")
def register_user(user: User):
    try:
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        return {"message": "User registered successfully", "uid": user_record.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Add Product
@app.post("/add_product")
def add_product(product: Product):
    products_db.append(product)
    return {"message": "Product added successfully", "product": product}

# Get Products
@app.get("/products", response_model=List[Product])
def get_products():
    return products_db

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

