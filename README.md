# 🚀 Milestack

Milestack is an escrow-based freelancing platform designed to eliminate **payment fraud** and **project ghosting** in small-scale freelance work.

## 💡 Problem

In traditional freelancing:
- Clients sometimes **don’t pay after work is completed**
- Freelancers sometimes **abandon projects after partial payment**
- No structured accountability system exists for small gigs

## ✅ Solution

Milestack introduces:
- 💰 **Escrow-based payments**
- 📌 **Milestone-driven projects**
- 🔒 **Mutual accountability for both client and freelancer**

---

## 🧠 Core Concept

Instead of informal agreements:

1. Freelancer creates a **gig for a specific client**
2. Project is divided into **milestones**
3. Client deposits money into **escrow**
4. Payment is released **only after milestone completion**

---

## ⚙️ Features (MVP)

- 👤 Single account (can act as both client & freelancer)
- 📄 Gig creation (freelancer → specific client)
- 🧩 Milestone breakdown system
- 💳 Escrow payment handling
- ✅ Milestone approval system
- 🔐 Authentication (JWT-based)

---

## 🏗️ Tech Stack

### Frontend
- React.js (planned)
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB (or MySQL)

### Other
- JWT Authentication
- Cloud Storage (AWS S3 or similar)

---

## 🔄 Workflow

1. Freelancer creates a gig with milestones
2. Client accepts and funds escrow
3. Freelancer completes milestone
4. Client approves → payment released
5. Repeat until project completion

---

## 🎯 Goals

- Prevent **client non-payment**
- Prevent **freelancer ghosting**
- Build **trust in informal freelance markets**
- Target **small gigs & Indian freelance ecosystem**

---

## 📦 Project Status

🚧 Currently in development (MVP phase)

---

## 🛠️ Setup (Basic)

```bash
# Clone the repo
git clone https://github.com/your-username/milestack.git

# Navigate to project
cd milestack

# Install dependencies
npm install

# Run server
npm run dev
