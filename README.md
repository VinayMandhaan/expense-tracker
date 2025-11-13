# Steps To Run

- To run the project kindly start the FE and BE server separately.
- To start BE server, cd full-stack-task && cd qashio-api
- Run  docker-compose up --build to start Nest Server
- To run FE Next.js, run yarn dev in the qashio-frontend-assignment

# Features Completed In This Task

## BE

- CRUD Operations and DTO Validations for Transactions, Category and Budget.
- Get Spending Summary Of Current Period
- Pagination, Sorting and Filtering
- Kafka Listner for Transaction Created
- ORM: TypeORM, DB: Postgres (Serverless)

## FE

- Integrated API using Next.js API and React Query
- MUI Components for UI
- Custom Input Validations and Error Handling
- Modular Components
- Pagination Filtering and Sorting
- Summary Report for Current Active Budget

## Swagger Docs

- http://localhost:3001/docs

## Demo

https://github.com/user-attachments/assets/717ee10e-dd82-4294-a3a9-0ea44bfa7ffe


# 💸 Simple Expense Tracker

Track your income, expenses, and budgets with a clean, event-driven architecture using **NestJS** and **Next.js**.

---

## 🧰 Tech Stack

### 🛠 Backend
- **Framework**: NestJS with TypeScript
- **ORM**: TypeORM (preferred) or Prisma
- **Database**: PostgreSQL (preferred) or SQL
- **Event Streaming**: Kafka (preferred)

### 💻 Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript + React 18+
- **UI Library**: MUI v7 (DataGrid, Dialogs, Forms)
- **State/Data**: React Query

---

## 📦 Backend Requirements

### 🔁 Transactions
CRUD operations for tracking individual entries:

- Properties:
  - `amount` 💰
  - `category` 🏷️
  - `date` 📅
  - `type` (`income` | `expense`)

### 🏷️ Categories
- Users can create and list categories
- Each transaction must belong to a category

### 💰 Budgets Module
- Set a budget (e.g., $500) per category over a time period (e.g., monthly)
- View current spending vs. budget

#### 🧩 Event-Driven Pattern
- Emit an event when a transaction is created or updated
- Listen for the event to (Optional) :
  - Log activity
  - Check budget usage
  - Perform related actions

---

## ✅ Technical Expectations

- Modular, maintainable structure
- Validate input using **DTOs**
- Centralized and custom error handling
- Auto-generate docs with **Swagger/OpenAPI**
- Use NestJS decorators (built-in and custom)
- JWT-based authentication (optional)

---

## 📡 API Endpoints (Minimum)

### Transactions
- `POST /transactions`
- `GET /transactions`
- `GET /transactions/:id`
- `PUT /transactions/:id`
- `DELETE /transactions/:id`

### Categories
- `POST /categories`
- `GET /categories`

---

## 🖥️ Frontend Requirements

### 🔍 `/transactions` Page
- Fetch transaction data with React Query (`/api/transactions`)
- Display paginated table (10 items per page)
- Support sortable columns and filters
- Reference design: `Transactions.fig`

### 📄 Transaction Detail View
- Click a row → open a modal or drawer
- Display full transaction details

### ➕ Create Transaction (`/transactions/new`)
- Form for adding a new transaction
- Includes category dropdown, date picker, and type selector

### 🚦 UX & Resilience
- Use loading spinners or skeletons
- Show MUI alerts on error
- Handle empty states (e.g., "No transactions found")

---

## 🚀 Backend Bonus Features
- JWT-based authentication
- Custom decorators, Guards, Pipes, filters ..etc.
- Summary/report endpoint (e.g., total income/expense for a date range)
- Filtering, sorting & pagination (by category, date, etc.)
- Unit tests for services/controllers

---

## 🚀 Frontend Bonus Features
- Form validation with Zod/Yup
- Unit tests for UI components and logic
- Global or advanced state management
- UI/UX enhancements beyond base design
- Filtering, sorting & pagination (by category, date, etc.)


---

## 📬 Deliverables

- A public **GitHub repository**

---

## 🚀 Running the Project

To start the entire application, simply run:

```bash
docker-compose up --build
```

This command will:
- Build the Docker images for both frontend and backend
- Start the services defined in `docker-compose.yml`
- Make the application accessible locally

Happy tracking! 💸
