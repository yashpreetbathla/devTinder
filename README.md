# DevTinder

A modern, real-time developer networking platform that connects developers based on their skills, interests, and projects. Inspired by Tinder, DevTinder makes it easy for developers to find and connect with like-minded professionals.

## 🚀 Features

- 🔐 Secure authentication and user profiles
- 🔍 Real-time connection requests and responses
- 🔄 Profile matching based on skills and interests
- 📱 Real-time notifications using Socket.IO
- 📊 User feed with relevant connections
- 🔄 Profile editing and password management
- 📧 Email notifications for important updates

## 📱 Architecture

```mermaid
graph TD
    A[Client] --> B[Express Server]
    B --> C[Authentication Service]
    B --> D[Profile Service]
    B --> E[Connection Service]
    B --> F[Notification Service]
    
    C --> G[JWT]
    C --> H[Password Hashing]
    
    D --> I[MongoDB]
    D --> J[Profile Management]
    
    E --> K[Connection Requests]
    E --> L[Real-time Updates]
    
    F --> M[Socket.IO]
    F --> N[Email Service (SES)]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#bfb,stroke:#333,stroke-width:2px
    style E fill:#bfb,stroke:#333,stroke-width:2px
    style F fill:#bfb,stroke:#333,stroke-width:2px
```

## 🛠️ Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & Bcrypt
- **Real-time**: Socket.IO
- **Email**: AWS SES
- **Cron Jobs**: node-cron
- **Validation**: Validator
- **Date Handling**: date-fns
- **Environment**: dotenv

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 API Endpoints

### Authentication
- POST `/auth/signup`
- POST `/auth/login`
- POST `/auth/logout`

### Profile Management
- GET `/profile/view`
- PATCH `/profile/edit`
- PATCH `/profile/password`

### Connections
- POST `/connections/request/send/:status/:userId`
- POST `/connections/request/review/:status/:requestId`
- GET `/user/connections`
- GET `/user/requests/received`
- GET `/user/feed`

## 📱 Real-time Features

- Real-time connection requests and responses
- Live updates to user feed
- Instant notifications for new connections
- Real-time status updates

## 🛡️ Security Features

- JWT-based authentication
- Bcrypt password hashing
- CORS protection
- Input validation
- Secure cookie handling
- Rate limiting

## 📝 License

ISC License

## 👤 Author

Yashpreet Bathla

---

DevTinder is a modern developer networking platform that brings the simplicity of Tinder to professional connections in the tech industry. Connect with developers who share your interests and skills in real-time.
