
# Smart Irrigation System – MERN Stack

A web-based smart irrigation system that allows farmers to **monitor, manage, and control their farms** efficiently. The dashboard provides **real-time data visualization, farm status (on/off), crop details, and water management**, while the Add Farm page enables **adding new farms with complete details (crop, soil, water tank, location, etc.)**.

---

## Features

### **Dashboard**
- Displays all farms with:
  - Crop name and icon
  - Farm ON/OFF status
  - Server online/offline indicator
  - Manual irrigation switch
  - Real-time farm overview in landscape layout

### **Add Farm Page**
- Add new farm with:
  - Farm Name
  - Crop Names (Rabi, Kharif, etc.)
  - Water Tank Size & Type (Circle/Rectangle with dynamic fields)
  - Soil Type
  - Farm Location (with map selector)
  - Pincode
- Light-colored UI for better visibility

### **Backend**
- REST API using **Node.js + Express**
- MongoDB database for storing farm details
- Real-time server status endpoints

### **Frontend**
- Built using **React.js + Tailwind CSS + Framer Motion**
- Responsive design (desktop-first)
- Light pastel theme for better UX

---

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Framer Motion, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Database:** MongoDB Atlas (or local MongoDB)
- **Map Integration:** (Optional) Leaflet.js / Mapbox
- **Version Control:** Git & GitHub

---

## Installation Guide

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/irrigationSystemSIH.git
cd irrigationSystemSIH
```

---

### **2. Backend Setup**
```bash
cd backend
npm install
```
- Create a `.env` file in `backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
BLYNK_API=your_blynk_iot_api_key
WEATHER_API=your_openWeatherApp_key
```
- Start the backend server:
```bash
npm run dev
```

---

### **3. Frontend Setup**
```bash
cd frontend
npm install
```
- Create a `.env` file in `frontend/`:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```
- Start the frontend:
```bash
node server.js
```

---

### **4. Access the App**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## Folder Structure
```
irrigation2/
├── backend/
│   ├── config/
│   │   └── config.js
│   ├── models/
│   │   └── sensorData.js
│   ├── services/
│   │   └── blynkService.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── ...other files
    ├── package.json
    └── ...other files
```

---

## Future Enhancements
- Weather-based automatic irrigation
- AI Controlling
- scheduled based integration
- Multi-language support

---

## License
This project is licensed under the **MIT License**.
