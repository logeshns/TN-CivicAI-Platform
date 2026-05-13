# CivicAI – Automated Complaint Routing System

CivicAI is a full-stack web application built to simplify civic complaint management using AI. Instead of filling out complicated forms, users can describe their issues in plain English, and the system automatically identifies the complaint category, severity level, and the appropriate government department.

The application uses a locally hosted Large Language Model through Ollama and LangChain4j to process complaints and convert unstructured text into structured complaint data.

---

# Tech Stack

Frontend

* React.js
* Vite
* Tailwind CSS

Backend

* Java
* Spring Boot 3
* Spring Security
* Spring Data JPA

Database

* MySQL

AI Integration

* LangChain4j
* Ollama (Phi-3)

Authentication

* JWT-based Authentication

---

# Features

## AI-Powered Complaint Processing

Users can submit complaints in natural language. The AI model automatically extracts:

* Complaint title
* Department
* Severity level

Example:
“There’s a huge pothole near the bus stand causing traffic every day.”

The system converts this into structured complaint data and routes it to the correct department.

---

## Role-Based Access

### Citizen Portal

* Submit complaints
* Track complaint status
* View complaint history

### Admin Dashboard

* View all complaints
* Monitor AI-generated routing
* Update complaint status
* Manage complaint workflow

---

## Secure Authentication

* OTP-based login flow
* JWT token authentication
* Protected APIs using Spring Security

---

## Fallback Handling

If the local AI model fails to respond or becomes unavailable, complaints are automatically redirected to a `MANUAL_REVIEW` queue to ensure the system continues functioning reliably.

---

# Project Structure

CivicAI/
│
├── Civic_Service/        → Spring Boot Backend
├── civic-frontend/       → React Frontend
└── README.md

---

# Local Setup

## 1. Prerequisites

Make sure the following are installed:

* Node.js & npm
* Java JDK 25
* MySQL Server
* Ollama

Install and run the Phi-3 model:

ollama run phi3

---

# 2. Database Setup

Create the database in MySQL:

CREATE DATABASE Civics;

---

# 3. Backend Setup

Navigate to the backend folder:

cd Civic_Service

Update database credentials inside:

src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/Civics
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

Run the Spring Boot application.

Hibernate will automatically create the required tables.

---

# 4. Frontend Setup

Open another terminal and navigate to the frontend folder:

cd civic-frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend runs at:

[http://localhost:5173](http://localhost:5173)

---

# API Endpoints

## Authentication

POST /api/auth/send-otp
→ Sends OTP

POST /api/auth/verify-otp
→ Verifies OTP and returns JWT

---

## Complaints

POST /api/complaints
→ Submit complaint

GET /api/complaints/my
→ Get user complaint history

GET /api/complaints/admin/all
→ Get all complaints (Admin)

PUT /api/complaints/admin/{id}/status
→ Update complaint status

---

# Future Improvements

* Email/SMS notifications
* Complaint image uploads
* Real-time admin analytics
* Geo-location based complaint mapping
* Multi-language complaint support

---

# Notes

* Ollama must be running before submitting complaints.
* Phi-3 runs completely locally.
* JWT authentication is stateless.
* The system is designed to continue functioning even if AI processing fails.

---

# License

This project was built for educational and learning purposes.
