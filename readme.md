# ⚡ JobFlow

> A full-stack job application management system with a Chrome Extension that automatically extracts job details from job portals and organizes them in a searchable dashboard.



## 📖 Overview

JobFlow helps job seekers save and organize job applications in one place.

Instead of manually copying job details into spreadsheets or notes, JobFlow extracts information directly from supported job portals using a Chrome Extension and stores it in a PostgreSQL database through a FastAPI backend.

The dashboard provides search, sorting, status tracking, and application management.

---

# ✨ Features

- 🔌 Chrome Extension
- 🌐 Multi-platform job extraction
    - Indeed
    - Naukri
- ⚡ FastAPI REST API
- 🗄 PostgreSQL Database
- 🔍 Search jobs
- ↕ Sort jobs
- 🗑 Delete jobs
- 📝 Update application status
- 📅 Applied date tracking
- 📄 Expandable job description
- 📊 Dashboard statistics
- 🔄 Refresh jobs

---

# 🏗 Architecture

```
                Chrome Extension

                       │

                       ▼

              FastAPI Backend

                       │

                       ▼

                 PostgreSQL

                       │

                       ▼

              JobFlow Dashboard
```

---

# 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

### Backend

- FastAPI
- SQLAlchemy
- Pydantic

### Database

- PostgreSQL

### Browser Extension

- Chrome Extension (Manifest V3)

---

# 📂 Project Structure

```
JobFlow/

│

├── backend/

│   ├── main.py

│   ├── database.py

│   ├── models.py

│   └── schemas.py

│

├── extension/

│   ├── popup/

│   ├── extractors/

│   ├── utils/

│   └── manifest.json

│

├── frontend/

│   ├── index.html

│   ├── style.css

│   └── app.js

│

└── README.md
```

---

# 🚀 Installation

## 1 Clone Repository

```bash
git clone https://github.com/yourusername/jobflow.git

cd jobflow
```

---

## 2 Setup Backend

```bash
cd backend

pip install -r requirements.txt
```

Configure PostgreSQL connection.

Start FastAPI

```bash
uvicorn main:app --reload
```

Backend

```
http://127.0.0.1:8000
```

---

## 3 Load Chrome Extension

Open

```
chrome://extensions
```

Enable

```
Developer Mode
```

Load

```
extension/
```

---

## 4 Run Dashboard

Open

```
frontend/index.html
```

or use Live Server.

---

# 📌 Workflow

```
Visit Job Portal

↓

Open Extension

↓

Click Save Job

↓

FastAPI stores job

↓

PostgreSQL saves record

↓

Dashboard displays job
```

---



# Supported Platforms

- ✅ Indeed
- ✅ Naukri

Future Support

- LinkedIn
- Wellfound
- Glassdoor

---

# Future Improvements

- Pagination
- Platform filters
- Status badges
- Export to CSV
- Authentication
- Analytics dashboard
- Dark/Light mode
- Notes for each application
- Interview reminders
- Email notifications

---

# Why JobFlow?

Most job seekers manually maintain spreadsheets to track applications.

JobFlow automates this workflow by collecting job details directly from supported platforms and organizing them in a searchable dashboard.

The project demonstrates:

- Browser Extension Development
- REST API Design
- FastAPI
- PostgreSQL
- CRUD Operations
- DOM Manipulation
- Web Scraping Concepts
- Full Stack Development

---

# Author

**Tushar Saini**

GitHub:
https://github.com/tushar17s

LinkedIn:
https://www.linkedin.com/in/tushar-saini-6a2b5b248 



---

