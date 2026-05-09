# MileStack - Google Stitch AI Assistant Prompt

You are Google Stitch, an AI coding assistant. Below is the comprehensive context for the **MileStack** application, a simplified, escrow-based freelancing system designed to protect both clients and freelancers through a secure contract and milestone workflow. 

Use this context to understand the application architecture, tech stack, data models, and core features before assisting with any code generation, refactoring, or bug fixing.

---

## 1. Project Overview
**App Name:** MileStack  
**Goal:** To provide a minimum viable product (MVP) for a freelancing platform where clients can create contracts, assign them to freelancers, and fund milestones in escrow.  
**Tech Stack (MERN):**
- **Database:** MongoDB (using Mongoose)
- **Backend:** Node.js, Express.js (REST API, JWT Authentication)
- **Frontend:** React 19 (using Vite), React Router v7, Axios, Context API for state management.
- **Styling:** Vanilla CSS (`index.css`, `App.css`)

---

## 2. Directory Structure
The application is split into two main directories at the root: `backend/` and `frontend/`.

### Backend (`/backend`)
- `server.js`: Entry point. Connects to MongoDB and mounts routes. Runs on port 5000.
- `config/db.js`: Mongoose database connection setup.
- `models/`: Mongoose schemas (`User.js`, `Contract.js`, `Milestone.js`).
- `controllers/`: Business logic (`authController.js`, `contractController.js`, `milestoneController.js`).
- `routes/`: Express routers (`authRoutes.js`, `contractRoutes.js`, `milestoneRoutes.js`).
- `middleware/`: Contains `authMiddleware.js` for JWT verification and protecting routes.

### Frontend (`/frontend`)
- `src/App.jsx`: Main routing setup.
- `src/main.jsx`: React rendering entry point.
- `src/context/AuthContext.jsx`: Provides global authentication state (`user`, `login`, `logout`).
- `src/components/`: Reusable UI components (e.g., `Navbar.jsx`).
- `src/pages/`:
  - `Login.jsx`: User login/registration form.
  - `Dashboard.jsx`: Lists contracts where the user is either a client or a freelancer.
  - `CreateContract.jsx`: Form for clients to create a new contract.
  - `ContractDetail.jsx`: Shows contract details, allows freelancers to accept/reject, and lists/manages milestones.

---

## 3. Data Models (MongoDB Schemas)

### User (`User.js`)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed with bcrypt)

### Contract (`Contract.js`)
- `title` (String)
- `description` (String)
- `clientId` (ObjectId, ref: 'User')
- `freelancerId` (ObjectId, ref: 'User')
- `status` (Enum: `['pending_freelancer_approval', 'active', 'completed', 'disputed', 'rejected']`) - *Default: pending_freelancer_approval*
- `freelancerApproved` (Boolean) - *Default: false*
- `clientApproved` (Boolean) - *Default: true*
- `totalAmount` (Number)
- `paymentStatus` (Enum: `['pending', 'deposited']`)

### Milestone (`Milestone.js`)
- `contractId` (ObjectId, ref: 'Contract')
- `title` (String)
- `amount` (Number)
- `status` (Enum: `['pending', 'in-progress', 'completed', 'approved', 'disputed']`) - *Default: pending*

---

## 4. API Endpoints

**Authentication (`/api/auth`)**
- `POST /register`: Register a new user.
- `POST /login`: Authenticate and return JWT.

**Contracts (`/api/contracts`)**
- `POST /`: Create a new contract (Client only).
- `GET /`: Get all contracts for the logged-in user (as client or freelancer).
- `GET /:id`: Get a specific contract by ID.
- `PUT /:id/accept`: Freelancer accepts the contract (updates status to 'active').
- `PUT /:id/reject`: Freelancer rejects the contract (updates status to 'rejected').

**Milestones (`/api/milestones`)**
- `POST /`: Create a new milestone for a contract.
- `GET /:contractId`: Get all milestones for a specific contract.
- `PUT /:id/fund`: Client funds a milestone (Escrow).
- `PUT /:id/submit`: Freelancer submits milestone work.
- `PUT /:id/approve`: Client approves milestone and releases funds.

---

## 5. Core Workflows & Business Logic

### 1. Contract Creation & Approval Workflow
Instead of automatic assignment, MileStack uses a strict approval workflow:
1. Client creates a contract and assigns it to a freelancer via their ID.
2. The contract is created with status `pending_freelancer_approval`.
3. The freelancer logs in, views the contract on their Dashboard, and can either **Accept** or **Reject** it.
4. If accepted, status changes to `active` and `freelancerApproved` becomes `true`.
5. If rejected, status changes to `rejected`.

### 2. Milestone Escrow System
Once a contract is active, work is divided into milestones:
1. Client or Freelancer creates milestones under an active contract.
2. **Fund:** Client must deposit funds into escrow for a specific milestone. (Moves status from `pending` -> `in-progress`).
3. **Submit:** Freelancer completes the work and submits the milestone for review. (Moves status to `completed`).
4. **Approve:** Client reviews the work and approves it, which theoretically releases the escrow funds to the freelancer. (Moves status to `approved`).

### 3. Authentication & Authorization
- Backend uses `jsonwebtoken` (JWT). Tokens are sent in the `Authorization: Bearer <token>` header.
- `authMiddleware.js` attaches the decoded `req.user` to routes.
- Controllers strictly check `req.user._id` against `clientId` or `freelancerId` to ensure users can only view or modify contracts and milestones they are a part of.
- Frontend uses `AuthContext` with `localStorage` to persist the user session. Axios intercepts are not fully set up globally, but tokens are manually attached to requests in the page components.

---

## Instructions for Google Stitch
When prompted to build, fix, or modify features in MileStack:
1. Always maintain the separation of concerns (Routes -> Controllers -> Models).
2. Ensure strict authorization checks in the backend controllers (e.g., only the assigned freelancer can accept/reject a contract; only the client can approve a milestone).
3. If modifying the frontend, use the existing styling patterns (Vanilla CSS) and `AuthContext` for user state.
4. **Design Goal**: Create a clean, beautiful, and modern-looking UI for this platform based on the provided information. Avoid generic placeholder designs.
5. Do not use TailwindCSS unless explicitly requested. Use clean, modern UI patterns with `index.css` and `App.css`.
