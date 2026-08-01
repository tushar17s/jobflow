from sqlalchemy.orm import declarative_base
from datetime import datetime
from sqlalchemy import Column , Integer , String , DateTime

base = declarative_base()


class JobCreate(base):
    # here we have to create column
    __tablename__ = "jobs"
    
    id = Column(Integer , primary_key=True , index=True)
    company = Column(String , index=True)
    role = Column(String)
    url = Column(String)
    platform = Column(String) 
    requirements = Column(String) 
    status = Column(String) 
    location = Column(String) 
    job_key = Column(String) 
    applied_at = Column(
        DateTime,
        default=datetime.now
    ) 