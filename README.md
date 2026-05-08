# ConvertPro 🚀

ConvertPro is a modern, full-stack SaaS application built to handle various file conversions (PDFs, Images, Video, and Documents) seamlessly. It features a premium Glassmorphism UI, a robust Node.js backend using top-tier conversion engines, built-in monetization via Razorpay, and Firebase Authentication.

![ConvertPro UI](https://via.placeholder.com/1200x600.png?text=ConvertPro+SaaS+Platform)

## ✨ Features

- **Modern UI:** Built with React, Tailwind CSS v3, Framer Motion, and Lucide Icons. Features dark mode, glass panels, and animated gradients.
- **File Conversions:** 
  - **PDF:** Merge and Compress (powered by `pdf-lib`).
  - **Images:** JPG to PNG and PNG to JPG (powered by `sharp`).
  - **Documents:** Word to PDF and PDF to Word (powered by `ConvertAPI`).
  - **Video:** MP4 to MP3 and MP4 to GIF (powered by `fluent-ffmpeg`).
- **Admin Dashboard:** Monitor server loads, active sessions, recent conversions, and manage users.
- **Monetization Ready:** Fully integrated Razorpay checkout system for upgrading users to "Premium".
- **Secure Authentication:** Firebase Google Login structure ready to go.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- React Dropzone (File Uploads)
- Axios

**Backend:**
- Node.js & Express
- Multer (File Handling)
- Sharp, pdf-lib, fluent-ffmpeg, convertapi (Processing)
- Razorpay SDK

## 🚀 Getting Started

### Prerequisites
- Node.js installed (v16+)
- API Keys for ConvertAPI, Razorpay, and Firebase (if deploying for production).

### 1. Backend Setup
Navigate to the backend folder, install dependencies, and start the server:
```bash
cd backend
npm install
node index.js
```
*Note: The backend runs on `http://localhost:3000`.*

### 2. Frontend Setup
Open a new terminal, navigate to the frontend folder, install dependencies, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend runs on `http://localhost:5173`.*

## ⚙️ Configuration (The Last 3 Steps)
To make the application 100% production-ready, update the following placeholders with your real keys:

1. **ConvertAPI:** In `backend/index.js`, replace the `convertapi` secret to enable Word/PDF conversions.
2. **Razorpay:** In `backend/index.js` and `frontend/src/pages/Pricing.jsx`, add your Razorpay Test/Live keys to enable payments.
3. **Firebase:** In `frontend/src/firebase.js`, add your Firebase config block to enable Google Authentication.

## 📄 License
MIT License - Free to use and modify.
