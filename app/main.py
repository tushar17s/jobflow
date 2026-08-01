from fastapi import FastAPI , Depends
from pydantic import BaseModel
from app.database import Session , engine
from app import db_models 
from fastapi.middleware.cors import CORSMiddleware
from app.schema import Create , StatusUpdate
from fastapi import Query
from sqlalchemy import or_


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# class db(BaseModel):
#     id : int
#     name : str
#     skill : str | None = None
    
# register = []

# @app.post("/")
# async def second(info:db):
#     register.append(info)
#     return "successfull"

# @app.get("/all")
# async def all():
#     return register

# @app.get("/{id}")
# async def one(id:int):
#     for i in register :
#         if i.id == id :
#             return i
#     return "not exists"


    
# create table at database
db_models.base.metadata.create_all(bind=engine)

# POST /applications
#         ↓
# Pydantic validation
#         ↓
# SQLAlchemy Session
#         ↓
# PostgreSQL

# GET /applications
#         ↓
# PostgreSQL
#         ↓
# JSON response

# creating first post api
def db_session():
    db = Session()
    try :
        yield db 
    finally :
        db.close()


# @app.post("/add")
# async def add(id : int , company : str , role : str , url : str , platform : str , status : str , db=Depends(db_session)):
#     application = db_models.Application(id=id,company=company,role=role,url=url,platform=platform,status=status)
#     db.add(application)
#     db.commit()
#     db.refresh()
#     return "data added successfully"

# @app.get("/all")
# async def all(db = Depends(db_session)):
#     data = db.query(db_models.Application).all()
#     return {
#         "total" : len(data),
#         "data" : data

#     }
@app.post("/jobs")
def create_job(job: Create,db=Depends(db_session)):
    job_key = job.company.lower().strip().replace(" ","") + job.role.lower().strip().replace(" ","")
    expected_job = (
        db.query(db_models.JobCreate).filter(
            db_models.JobCreate.job_key == job_key
        ).first()
    )
    if expected_job:
        return {
            "success": False,
            "message": "Already Saved"  
        }
        
    db_job = db_models.JobCreate(
    company=job.company,
    role=job.role,
    location=job.location,
    platform=job.platform,
    url=job.url,
    requirements=job.requirements,
    status="Saved",
    job_key = job_key
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return {
        "success": True,
        "message": "Job Saved",
        "id": db_job.id
    }
    
# FastAPI can also validate query parameters before your function even runs.
# ge = greater than or equal to
# le = lower than or equal to

@app.get("/all")
def all_jobs(db = Depends(db_session),
             page : int =  Query(1,ge = 1) ,
             page_size : int = Query(10,ge=1,le=10),
             search : str | None = None ,
             sort : str | None = None
             ):
    offset = (page-1)*page_size
    query = (db.query(db_models.JobCreate))
    if search :
        query = query.filter(or_(
            db_models.JobCreate.company.ilike(f"%{search}%"),
            db_models.JobCreate.role.ilike(f"%{search}%"),
            db_models.JobCreate.location.ilike(f"%{search}%"),
            db_models.JobCreate.requirements.ilike(f"%{search}%")
        ))
        # here object is created not data for data we have to use .all()
    
    if sort :
        query = query.order_by(
        db_models.JobCreate.applied_at.desc()
        )


       # Apply pagination
    jobs = (query
            .offset(offset)
            .limit(page_size)
            .all()
            )
    return jobs

# the updat endpoint : updates the status

@app.patch("/update/{id}")
def update(id : int ,status : StatusUpdate , db = Depends(db_session),
           ):
    job = db.query(db_models.JobCreate).get(id)
    if job :
        job.status = status.status
        db.commit()
        db.refresh(job)
        return {
            "message" : " status updated successfully" 
        }
        
    return {
        "messasge " : "no jobs found"
    }
    
@app.delete("/delete/{id}")
def delete_job(id : int , db = Depends(db_session)):
    job = db.query(db_models.JobCreate).filter(db_models.JobCreate.id == id).first()
    if job :
        db.delete(job)
        db.commit()
        return {
            "messge" : "job deleted successfully"
        }
    return {
        "message" : "job not found"
    }