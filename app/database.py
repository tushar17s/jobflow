# you have to generate a session to talk to a database 
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
# engine here helps you to connect to a database
db_url = "postgresql://postgres:postgres@localhost:5433/jobserver"
# here : "postgresql://user_name:password@localhost:port/server_name"
engine = create_engine(db_url)
Session = sessionmaker(autoflush=False , autocommit = False , bind=engine)