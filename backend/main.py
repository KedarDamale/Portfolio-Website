from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
async def hello():
    return {'msg':'Hello Kedar!'}

@app.get('/name')
async def name(n):
    return {"msg": f"Hello {n}"}