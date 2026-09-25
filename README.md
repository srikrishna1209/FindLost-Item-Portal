# 📦 FindLost – College Lost & Found Portal

A full-stack college Lost & Found management web application that allows students to report lost and found items, search for items, view item details, submit claims, and track their reported items and claims. The system also provides administrators with a dashboard to manage items, claims, and contact messages.

🌐 **Live Website:** https://find-lost-item-portal.vercel.app

---

## 📖 Project Overview

The **FindLost – College Lost & Found Portal** is designed to simplify the process of reporting and recovering lost belongings within a college campus.

Users can report lost or found items with details and images, search for matching items, and submit claims for items they believe belong to them.

Administrators can manage reported items, review claims, manage contact messages, and monitor the Lost & Found system through a dedicated admin dashboard.

This project was developed using **React.js**, **Spring Boot**, and **PostgreSQL** following a REST API architecture.

---

## ✨ Features

### 👤 User Features

- User Registration
- User Login
- Browse Lost Items
- Browse Found Items
- Search Items
- View Item Details
- Report Lost Items
- Report Found Items
- Upload Item Images
- View My Reported Items
- Submit Claims
- View My Claims
- Track Claim Status
- Contact Administration
- View Returned Items

---

### 👨‍💼 Admin Features

- Admin Login
- Admin Dashboard
- View Dashboard Statistics
- Item Management
- View Reported Items
- Claim Management
- Review Claim Requests
- Approve Claims
- Reject Claims
- Contact Message Management
- View Contact Messages
- Update Message Status
- Manage Item Status
- Monitor Returned Items

---

## 🔒 Access Control

- User Protected Routes
- Admin Protected Routes
- JWT Authentication
- Role-Based Access Control
- USER and ADMIN Roles
- Users cannot access Admin Pages

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- HTML5
- CSS3
- JavaScript (ES6)

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven
- REST API

### Database

- PostgreSQL
- Neon PostgreSQL

### Tools

- VS Code
- IntelliJ IDEA
- Postman
- Git
- GitHub
- MySQL Workbench
- Neon Console
- Render
- Vercel

---

## 📂 Project Structure

```text
FindLost-Item-Portal
│
├── Frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── Backend
│   ├── src
│   ├── pom.xml
│   └── ...
│
└── README.md
```
## 🗄️ Database

The project uses **PostgreSQL** as the production relational database through **Neon PostgreSQL**.

Main data includes:

- Users
- Lost Items
- Found Items
- Claims
- Contact Messages

The project was initially developed using MySQL and later migrated to PostgreSQL for the deployed application.

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/srikrishna1209/FindLost-Item-Portal.git
```

---

### Backend

```bash
cd Backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

### Frontend

```bash
cd Frontend
```

Install Dependencies:

```bash
npm install
```

Run Project:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📷 Screenshots

Add screenshots of:

- Home Page
- Login Page
- Registration Page
- Lost Items
- Found Items
- Item Details
- Report Lost Item
- Report Found Item
- My Items
- My Claims
- Admin Dashboard
- Admin Claims
- Contact Messages

---

## ☁️ Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- Neon PostgreSQL

---

## 🔮 Future Improvements

- Email Notifications
- Forgot Password
- Advanced Search and Filtering
- Automatic Lost & Found Item Matching
- Cloud Image Storage
- Notification System
- Advanced Admin Analytics
- Improved Mobile Responsiveness
- Enhanced Claim Verification

---

## 📚 Learning Outcomes

This project helped in understanding:

- REST API Development
- Spring Boot Architecture
- CRUD Operations
- React Component Architecture
- API Integration using Axios
- PostgreSQL Database Design
- JWT Authentication
- Role-Based Access Control
- Admin Dashboard Development
- Claims Management
- Full-Stack Application Development
- Git & GitHub Version Control
- Vercel Deployment
- Render Deployment
- Neon PostgreSQL

---

## 👨‍💻 Author

**Jogi Srikrishna**

B.Tech - Information Technology

GitHub: [https://github.com/srikrishna1209](https://github.com/srikrishna1209)

---

## ⭐ Version

**Current Version:** 1.0

---

## 📄 License

This project is developed for educational purposes and personal learning.
