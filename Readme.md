# Mental Health Check-in Web Application 🧠

A secure, responsive full-stack web application for daily mental health check-ins.


## 📋 Features

- 🔐 Secure user authentication with JWT
- 📝 Daily mental health check-ins
- 🔒 Encrypted journal entries
- 📊 Mood tracking visualization
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Axios
- Recharts
- React Router v6

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt encryption
- Express Validator

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash

cd mental-health-checkin
\`\`\`

2. Install dependencies:
\`\`\`bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
\`\`\`

3. Set up environment variables:

Create `.env` in server directory:
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_32_character_key
\`\`\`

4. Run the application:
\`\`\`bash
# Run backend (from server directory)
npm run dev

# Run frontend (from client directory)
npm start
\`\`\`

## 📱 Screenshots







