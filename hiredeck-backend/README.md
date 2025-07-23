# Hiredeck Backend

## Overview
The Hiredeck backend is a FastAPI application designed to facilitate the management of candidate profiles, including a resume upload feature. This project integrates with Supabase for storage and database management.

## Features
- Resume upload functionality
- Candidate profile management
- Integration with Supabase for storage and database

## Project Structure
```
hiredeck-backend
├── src
│   ├── main.py                # Entry point of the FastAPI application
│   ├── api
│   │   └── resume_upload.py    # Endpoint for uploading resumes
│   ├── models
│   │   └── candidate_profiles.py # Data model for candidate profiles
│   ├── services
│   │   └── supabase_storage.py  # Logic for interacting with Supabase storage
│   └── db
│       └── database.py         # Database connection setup
├── requirements.txt            # Project dependencies
├── README.md                   # Project documentation
└── .env                        # Environment variables
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd hiredeck-backend
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-key>
   ```

## API Endpoints
### Upload Resume
- **Endpoint:** `/upload_resume`
- **Method:** `POST`
- **Fields:**
  - `full_name`: The full name of the candidate.
  - `email`: The email address of the candidate.
  - `domain`: The domain of expertise.
  - `resume_file`: The PDF file of the resume.

## Usage Example
To upload a resume, send a POST request to the `/upload_resume` endpoint with the required fields.

## License
This project is licensed under the MIT License.