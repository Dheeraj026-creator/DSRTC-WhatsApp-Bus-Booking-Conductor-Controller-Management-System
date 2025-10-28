# 🚌 DSRTC – WhatsApp Bus Booking, Conductor & Controller Management System  

📍 **Focused on Bangalore–Mysore Non-Stop Service**  

This project is designed to modernize intercity travel — specifically the **Bangalore–Mysore non-stop bus route** — by automating booking, conductor verification, and ticket generation through **WhatsApp integration** and **Razorpay payment gateway**.  


🔗 Live Links
🧑‍💼 Controller Dashboard (Add / Delete Buses):
👉 https://dsrtc-whatsapp-bus-booking-conductor.onrender.com
🧑‍✈️ Conductor Dashboard (Scan & Verify Passengers):
👉 https://dsrtc-whatsapp-bus-booking-conductor.onrender.com/conductor
---

## 🚀 Overview

**DSRTC – WhatsApp Bus Booking, Conductor & Controller Management System** is a Node.js-based project integrating **WhatsApp Cloud API**, **Razorpay**, and **MongoDB** to create a seamless smart bus booking experience.  

It enables:  
- Passengers to book tickets directly via WhatsApp.  
- Automatic QR ticket generation for passengers.  
- Conductor verification and scanning system.  
- Admin/Controller to add, edit, or remove buses.  
- In-memory passenger tracking for conductors.  

---

## ⚙️ Features

- 💬 WhatsApp-based passenger interaction and booking  
- 💳 Secure online payments via Razorpay  
- 🎟️ Auto-generated QR tickets for passengers  
- 👨‍✈️ Conductor login and passenger verification  
- 🧭 Controller (Admin) dashboard to manage buses  
- ⏰ 24-hour format for scheduling and non-stop service tracking  
- ☁️ MongoDB Atlas for cloud database storage  
- 🧩 EJS templating for admin and conductor views  

---

## 🧰 Tech Stack

**Backend:** Node.js, Express.js  
**Database:** MongoDB / Mongoose  
**Frontend:** EJS Templates  
**Payments:** Razorpay API  
**Messaging:** WhatsApp Cloud API (Meta)  
**Auth:** Passport.js  
**Other:** QRCode, Session, Axios  

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone git@github.com:Dheeraj026-creator/DSRTC-WhatsApp-Bus-Booking-Conductor-Controller-Management-System.git
cd DSRTC-WhatsApp-Bus-Booking-Conductor-Controller-Management-System


2️⃣ Install dependencies
     npm install


3️⃣ Create a .env file in the project root

MONGODB_URI=your_mongodb_connection_string  
RAZORPAY_KEY_ID=your_razorpay_key_id  
RAZORPAY_KEY_SECRET=your_razorpay_secret_key  
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret  
WHATSAPP_TOKEN=your_meta_whatsapp_access_token  
PHONE_NUMBER_ID=your_meta_whatsapp_phone_number_id  
VERIFY_TOKEN=dsrtc_verify  
PUBLIC_URL=http://localhost:3000  
KSRTC_SIGNUP_CODE=your_admin_code

4️⃣ Run the server
   node server.js


🚏 License
This project is licensed under the MIT License — feel free to use, modify, and share it with attribution.
💡 Notes
Designed specifically for Bangalore–Mysore Non-Stop Bus Service.
For production, environment variables are handled internally (no ngrok required).
Built and maintained by Dheeraj Pujar 🚀
