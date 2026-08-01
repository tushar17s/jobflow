from datetime import datetime
from pydantic import BaseModel

# as every method in fastapi wants its schema as it requires or yoeds its different data
class Create(BaseModel):
    company: str
    role: str
    location: str
    platform: str
    url: str
    requirements: str
    
# schema for the patch endpoint

class StatusUpdate(BaseModel):
    status : str