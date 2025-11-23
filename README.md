# mini_wallet_service (Node.js + Express + Prisma + PostgreSQL)
 
A production-ready Wallet Management System built using **Node.js**, **Express**, **JWT Authentication**, **Prisma ORM**, and **PostgreSQL**.

This project includes:
✔ User Authentication  
✔ Wallet Creation  
✔ Credit/Debit Transactions  
✔ User Settings (Enable/Disable)  
✔ Transaction Limit Control  
✔ Admin Access Control  
✔ Admin Dashboard Summary  
✔ Transaction Filters & Pagination  

---

##  Features

###  User Features
- Register & Login (JWT based)
- Auto Wallet Creation on Registration
- View Wallet Balance
- Credit / Debit Money
- Summary (today, weekly, monthly)
- View Transactions (search, filter, paginate)

###  Admin Features
- Enable / Disable any user
- Set/Reset individual transaction limits
- View all transactions across all users
- View detailed user profile (wallet + settings + summary)
- Admin Dashboard:
  - total users
  - active/disabled users
  - total wallets
  - total transactions
  - total credit/debit amounts


## Database Schema (Prisma)

Models included:
- **User**  
- **Wallet**  
- **Settings**  
- **Transaction**  
- **Enums: Role, TransactionType, TransactionStatus**

You can find the schema in:  
`prisma/schema.prisma`

---

## 📁 Project Structure
mini_wallet_service/
│── src/
│ ├── app.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── walletRoutes.js
│ │ ├── transactionRoutes.js
│ │ ├── adminRoutes.js
│ │ └── userRoutes.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ ├── roleMiddleware.js
│ │ ├── activeMiddleware.js
│ │ └── transactionMiddleware.js
│ └── scripts/
│── prisma/schema.prisma
│── package.json
│── README.md


📌 API Endpoints Summary
🔹 Auth Routes

POST /auth/register

POST /auth/login

🔹 Wallet Routes

GET /wallets
→ Fetch wallet using token

🔹 Transaction Routes

POST /transactions (credit/debit)

GET /transactions (pagination, filter)

GET /transactions/summary

🔹 Admin Routes

PATCH /admin/users/:id/status

PATCH /admin/users/:id/limit

GET /admin/users/:id

GET /admin/dashboard

GET /admin/transactions

 Testing Checklist
User

✔ Register
✔ Login
✔ Credit
✔ Debit
✔ Summary
✔ List Transactions

Admin
✔ Enable/Disable Users
✔ Increase/Reset Limit
✔ View All Transactions
✔ Dashboard
✔ View user full summary
