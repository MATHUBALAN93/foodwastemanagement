# FoodShare - Food Donation Management SaaS Platform

A comprehensive MERN stack platform connecting restaurants, NGOs, volunteers, and administrators to reduce food waste and fight hunger through efficient food donation management.

## 🌟 Features

### Authentication & Role Management
- JWT-based authentication with email/password
- Role-based access control (Restaurant, NGO, Volunteer, Admin)
- Secure user registration and profile management

### Restaurant Features
- Add surplus food donations with detailed information
- Upload food photos and set expiry times
- Track donation history and status
- Real-time notifications for donation updates
- Impact analytics and donation history

### NGO Features
- Browse nearby available donations with map view
- Accept/reject donations based on requirements
- Mark donations as picked up or delivered
- Track collected donations and distribution metrics

### Volunteer Features
- Register as delivery volunteer
- View available delivery tasks
- Mark donations as in-transit or delivered
- Track delivery history and earnings
- Rating and feedback system

### Admin Features
- Comprehensive user management (approve/block users)
- Platform analytics and impact metrics
- Monitor donations and user activity
- Leaderboard and achievement system
- Handle reports and disputes

### Core Functionality
- Real-time notifications system
- Automatic expiry handling
- Advanced filtering and search
- Mobile-responsive design
- Impact tracking and analytics
- Professional dashboard with charts

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and micro-interactions
- **Recharts** - Data visualization and charts
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **Socket.io** - Real-time communication

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd foodshare-platform
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

3. **Environment Setup**
```bash
# Copy environment file
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/foodshare
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
```

4. **Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client  # Frontend on http://localhost:5173
npm run dev:server  # Backend on http://localhost:3001
```

## 📁 Project Structure

```
foodshare-platform/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── Auth/                # Authentication components
│   │   ├── Dashboard/           # Role-specific dashboards
│   │   ├── Layout/              # Navigation and layout
│   │   └── Common/              # Shared components
│   ├── context/                 # React context providers
│   ├── pages/                   # Page components
│   └── App.tsx                  # Main application component
├── server/                      # Backend Node.js application
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # Express routes
│   ├── middleware/              # Custom middleware
│   └── server.js               # Express server setup
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Donations
- `GET /api/donations/available` - Get available donations
- `POST /api/donations` - Create new donation (Restaurant)
- `GET /api/donations/my-donations` - Get user's donations
- `POST /api/donations/:id/accept` - Accept donation (NGO)
- `PUT /api/donations/:id/status` - Update donation status

## 👥 User Roles & Permissions

### Restaurant
- Create and manage food donations
- Upload food photos
- Track donation status and history
- View impact analytics

### NGO
- Browse and accept available donations
- Manage accepted donations
- Track collection and distribution
- Mark donations as picked up

### Volunteer
- View available delivery tasks
- Accept delivery assignments
- Update delivery status
- Track earnings and ratings

### Admin
- Manage all users and permissions
- View platform-wide analytics
- Monitor donation activities
- Handle reports and disputes

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- **Desktop** (1024px+) - Full dashboard experience
- **Tablet** (768-1023px) - Adapted layouts
- **Mobile** (< 768px) - Touch-optimized interface

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Green (#10B981)
- **Accent**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: 120% line height
- **Body**: 150% line height
- **Maximum 3 font weights**

### Spacing
- **8px spacing system**
- Consistent padding and margins
- Proper visual hierarchy

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render/Heroku)
```bash
cd server
npm install
npm start
```

### Environment Variables
Set the following in production:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key
- `FRONTEND_URL` - Frontend domain for CORS

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

Built with ❤️ for reducing food waste and fighting hunger.