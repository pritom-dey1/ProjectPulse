# ProjectPulse – Client Feedback & Project Health Tracker

ProjectPulse is a full-stack web application designed to help software teams monitor project health, client satisfaction, employee progress, and delivery risks in real time.

Clients provide structured weekly feedback and flag issues, employees submit progress updates and report risks, while admins get a centralized dashboard with automatic health scoring to identify problems early.

---
## 🎯 Core Features

- Role-based access control (Admin / Employee / Client)
- Secure authentication using JWT
- Weekly employee check-ins (progress, blockers, confidence, completion %)
- Weekly client feedback (satisfaction, communication clarity, issue flagging)
- Risk reporting & resolution
- Automatic Project Health Score (0–100)
- Health status classification (On Track / At Risk / Critical)
- Role-based real-time notification system
- Admin, Employee, and Client dashboards
- Activity timeline per project
- Responsive UI with dark theme & smooth animations
- Data visualization using charts

---

## 🧱 Tech Stack

- Next.js (App Router + API Routes)
- Tailwind CSS
- MongoDB Atlas
- JWT Authentication + Role-based Authorization
- Recharts & Framer Motion

---

## 👥 User Roles

### Admin
- Create and manage projects
- Assign clients and employees
- Monitor project health scores
- View all risks across projects
- Receive system-wide notifications

### Employee
- Submit weekly check-ins
- Report risks and blockers
- Track assigned projects

### Client
- Submit weekly feedback
- Flag issues
- Track project health

---

## 🔐 Demo Login Credentials

**Admin**  
Email: admin@projectpulse.com  
Password: admin123  

**Employee**  
Email: employee@projectpulse.com  
Password: emp123  

**Client**  
Email: client@projectpulse.com  
Password: client123  
---

## 📊 Project Health Score Logic

The Project Health Score is calculated automatically whenever a project receives a new employee check-in, risk update, or timeline evaluation.

The system starts with a **base score of 100** and applies deductions based on real-time project conditions to reflect the true health of the project.

---

### 1. Open Risk Penalty

- Each unresolved risk reduces the score by **8 points**
- Only risks with status other than `Resolved` are counted

This ensures that projects with multiple unresolved risks are marked unhealthy early.

---

### 2. Employee Confidence Impact

- Employee confidence is averaged from submitted check-ins
- Confidence scale: **1–5**
- Penalty formula:

```
(5 - averageConfidence) × 7
```

- If no check-ins are available, a **–20 point** penalty is applied

This prevents inactive projects from appearing healthy.

---

### 3. Progress vs Timeline Evaluation

- Project completion percentage is taken from the most recent check-in
- Expected progress is calculated using project start and end dates
- If actual progress is behind schedule, the gap is penalized:

```
(expectedProgress - actualCompletion) × 0.7
```

This keeps the score aligned with delivery timelines.

---

### 4. Overdue Project Penalty

- If the current date exceeds the project end date
- And the project is not marked as `COMPLETED`

A **–25 point** penalty is applied.

---

### 5. Final Score Normalization

- The score is clamped between **0 and 100**
- The value is rounded to the nearest integer

Health status mapping:
- **80–100:** On Track
- **60–79:** At Risk
- **Below 60:** Critical

The final score and status are stored on the project and updated dynamically.


---

## ⚙️ Setup Instructions

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file with required environment variables.

Run development server:

```bash
npm run dev
```

---


## 👨‍💻 Author

Pritom Dey
