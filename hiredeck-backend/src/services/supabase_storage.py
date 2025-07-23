from supabase import create_client, Client
import os

# Initialize Supabase client
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def upload_file(file_name: str, file_data: bytes) -> str:
    """Uploads a file to Supabase storage and returns the public URL."""
    response = supabase.storage.from_("resumes").upload(file_name, file_data)
    if response.status_code == 200:
        return supabase.storage.from_("resumes").get_public_url(file_name)
    else:
        raise Exception("File upload failed: " + response.message)

def get_file_url(file_name: str) -> str:
    """Retrieves the public URL of a file stored in Supabase."""
    return supabase.storage.from_("resumes").get_public_url(file_name)