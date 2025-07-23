from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from services.supabase_storage import upload_file_to_supabase
from models.candidate_profiles import CandidateProfile
from db.database import get_db
from sqlalchemy.orm import Session
import fitz  # PyMuPDF

router = APIRouter()

@router.post("/upload_resume")
async def upload_resume(
    full_name: str = Form(...),
    email: str = Form(...),
    domain: str = Form(...),
    resume_file: UploadFile = File(...)
):
    # Save the resume file to Supabase storage
    file_url = await upload_file_to_supabase(resume_file)

    # Extract text from the PDF
    pdf_text = extract_text_from_pdf(resume_file)

    # Save candidate profile to the database
    db: Session = get_db()
    candidate_profile = CandidateProfile(
        full_name=full_name,
        email=email,
        domain=domain,
        resume_url=file_url,
        resume_text=pdf_text
    )
    db.add(candidate_profile)
    db.commit()
    db.refresh(candidate_profile)

    return JSONResponse(content={"message": "Resume uploaded successfully", "candidate_id": candidate_profile.id})

def extract_text_from_pdf(uploaded_file: UploadFile) -> str:
    pdf_document = fitz.open(stream=await uploaded_file.read(), filetype="pdf")
    text = ""
    for page in pdf_document:
        text += page.get_text()
    pdf_document.close()
    return text