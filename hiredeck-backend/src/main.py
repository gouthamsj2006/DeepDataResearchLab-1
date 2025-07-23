from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.resume_upload import router as resume_upload_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_upload_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Hiredeck API"}