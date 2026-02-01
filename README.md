🏜️ Arrakis Signal – Civic Complaint Management System

Arrakis Signal is a full-stack web platform that enables citizens to report civic issues and allows municipal staff and administrators to manage, track, and resolve complaints efficiently with OTP-based authentication, SLA monitoring, and role-based dashboards.

🚀 Features 👤 Authentication & Security

OTP-based Register & Login

Forgot Password via secure email link

Role-based access (Citizen / Staff / Admin)

JWT authentication & protected routes

🧑‍💼 Citizen Portal

Raise complaints with:

Title, description, category

Image upload

Auto-detected location (lat/lng)

Track complaint status in real time

View complaint lifecycle & SLA status

Receive email notifications on status updates

🧑‍🔧 Staff Dashboard

View assigned complaints

Update complaint status

Add remarks

SLA breach & deadline warnings

Generate complaint PDF reports

🛡️ Admin Dashboard

View all complaints

Assign complaints to staff

Update status & priority

Delete complaints

Analytics dashboard:

Total complaints

Resolved vs pending

Category-wise stats

SLA breach monitoring

Generate downloadable PDF reports

📊 Advanced Features

SLA tracking (On-Track / Nearing Deadline / Breached)

Email notifications on:

Status change

Overdue complaints

Interactive heatmap showing complaint density

Public transparency dashboard (read-only)

🛠️ Tech Stack Frontend

React (Vite)

Tailwind CSS

Axios

React Router

Leaflet (Maps)

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Nodemailer (Email)

Cloudinary (File uploads)

PDFKit (Report generation)

📂 Project Structure Frontend/ ├── src/ │ ├── api/ │ ├── pages/ │ │ ├── auth/ │ │ ├── citizen/ │ │ ├── staff/ │ │ ├── admin/ │ ├── components/ │ ├── routes/ │ ├── context/ │ └── utils/

Backend/ ├── controllers/ ├── routes/ ├── models/ ├── middlewares/ ├── utils/ └── server.js

▶️ Running Locally Backend cd Backend npm install npm run dev

Frontend cd Frontend npm install npm run dev

🌍 Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

✔ Fully cloud deployed with HTTPS ✔ Production-ready environment setup

🎯 Use Case

This system is ideal for:

Smart city projects

College / final-year projects

Government complaint portals

Civic transparency platforms

🤝 Author

Rahul Kumar(Backend),Manish Sevda(Frontend)

⭐ Support

If you like this project, give it a ⭐ on GitHub!
