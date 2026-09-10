from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, programmes, courses, certificates, jobs, analytics
from app.seed import run_seed_if_empty

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CoopConnect Bharat API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(programmes.router)
app.include_router(courses.router)
app.include_router(certificates.router)
app.include_router(jobs.router)
app.include_router(analytics.router)


@app.on_event("startup")
def seed_on_startup():
    run_seed_if_empty()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "coopconnect-bharat-api"}
