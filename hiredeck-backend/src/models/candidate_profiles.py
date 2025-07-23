from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CandidateProfile(Base):
    __tablename__ = 'candidate_profiles'

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, index=True)
    domain = Column(String, index=True)
    resume_file_url = Column(String)  # URL of the uploaded resume file
    created_at = Column(String)  # You may want to use DateTime for actual timestamps

    def __repr__(self):
        return f"<CandidateProfile(full_name={self.full_name}, email={self.email}, domain={self.domain})>"