🚌 DSRTC – WhatsApp Bus Booking, Conductor & Controller Management System
📍 Focused on Bangalore–Mysore Non-Stop Service
This project is designed to modernize intercity travel, specifically the Bangalore–Mysore non-stop bus route, by automating booking, conductor verification, and ticket generation — all through WhatsApp integration and Razorpay payment gateway.
🚀 Overview
DSRTC – WhatsApp Bus Booking, Conductor & Controller Management System is a Node.js-based project that integrates WhatsApp Cloud API, Razorpay, and MongoDB to create a seamless smart bus booking experience.
It enables:
Passengers to book tickets directly via WhatsApp
Automatic QR ticket generation
Conductor verification and scanning system
Admin (Controller) to add, edit, or remove buses
In-memory passenger tracking for conductors
⚙️ Features
💬 WhatsApp-based passenger interaction and booking
💳 Secure online payments via Razorpay
🎟️ Auto-generated QR tickets for passengers
🚌 Conductor login and passenger verification
👨‍💼 Controller (Admin) dashboard to manage buses
⏰ 24-hour format for scheduling and non-stop service tracking
🌐 MongoDB Atlas for cloud database storage
🪄 EJS templating for admin and conductor views
🧩 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB / Mongoose
Frontend: EJS Templates
Payments: Razorpay API
Messaging: WhatsApp Cloud API (Meta)
Auth: Passport.js
Other: QRCode, Session, Axios
🛠️ Installation & Setup
Clone the repository
git clone git@github.com:Dheeraj026-creator/DSRTC-WhatsApp-Bus-Booking-Conductor-Controller-Management-System.git
cd DSRTC-WhatsApp-Bus-Booking-Conductor-Controller-Management-System
Install dependencies
npm install
Create a .env file in the project root and add your credentials:
MONGODB_URI=your_mongodb_connection_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
WHATSAPP_TOKEN=your_meta_whatsapp_access_token
PHONE_NUMBER_ID=your_meta_whatsapp_phone_number_id
VERIFY_TOKEN=dsrtc_verify
PUBLIC_URL=http://localhost:3000
KSRTC_SIGNUP_CODE=your_admin_code
Run the server
node server.js
The app will be live at:
http://localhost:3000
👨‍💻 Project Flow
Passenger sends “Hi” on WhatsApp → selects destination (Mysore/Bangalore).
Passenger enters passenger count → selects an available bus.
Receives Razorpay payment link → pays securely.
Webhook captures successful payment → system generates QR ticket.
Ticket is automatically sent to the user via WhatsApp.
Conductor scans/records passengers → controller monitors buses.
🧾 License
MIT License

Copyright (c) 2025 Dheeraj Pujar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
✅ Project by: Dheeraj Pujar
📍 Built with focus on Bangalore–Mysore Non-Stop Smart Bus Service
