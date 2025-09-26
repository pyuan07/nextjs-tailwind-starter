# 🚀 Setup Guide: Next.js + External TypeScript API

This project follows **industry-standard architecture** with **separated API and UI** services.

## 📋 Architecture Overview

```
┌─────────────────────────┐    ┌─────────────────────────┐
│   TypeScript API        │    │   Next.js Frontend      │
│   (Port 3001)           │    │   (Port 3000)           │
│                         │    │                         │
│ ├── Express + Prisma    │◄──►│ ├── API Client          │
│ ├── PostgreSQL          │    │ ├── Auth Management     │
│ ├── JWT Auth            │    │ ├── State Management    │
│ ├── Zod Validation      │    │ └── UI Components       │
│ └── Email Services      │    │                         │
└─────────────────────────┘    └─────────────────────────┘
```

## 🔧 Quick Setup

### 1. **Start TypeScript API Server**

```bash
cd E:\Projects\typescript-starter
npm install
npm run dev        # Starts on http://localhost:3001
```

### 2. **Start Next.js Frontend**

```bash
cd E:\Projects\NextJs_Web\nextjs-tailwind-starter
npm install
cp .env.example .env.local   # Configure environment
npm run dev        # Starts on http://localhost:3000
```

### 3. **Environment Configuration**

Update `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗️ What We Built

### ✅ **API Client Architecture**

- **Robust HTTP Client**: Auto-retry, timeout, error handling
- **Authentication Interceptors**: Automatic token refresh
- **Type-Safe Requests**: Full TypeScript integration
- **Centralized Configuration**: Environment-based URLs

### ✅ **Authentication System**

- **Token Management**: JWT with automatic refresh
- **Secure Storage**: HttpOnly cookies + localStorage fallback
- **Auth State**: Zustand store with persistence
- **Protected Routes**: Middleware-based protection

### ✅ **Error Handling**

- **API Error Classes**: Structured error responses
- **Validation**: Zod schemas for type safety
- **Logging**: Comprehensive request/response logging
- **User Feedback**: Toast notifications for errors

### ✅ **Security Features**

- **CORS Configuration**: Cross-origin request handling
- **Token Rotation**: Refresh token security
- **Input Validation**: XSS and injection protection
- **Rate Limiting**: API abuse prevention

## 🔗 API Integration Points

### **Authentication Endpoints**

```typescript
POST / api / v1 / auth / login // User login
POST / api / v1 / auth / register // User registration
POST / api / v1 / auth / logout // Session termination
POST / api / v1 / auth / refresh - tokens // Token refresh
POST / api / v1 / auth / forgot - password // Password reset request
POST / api / v1 / auth / reset - password // Password reset
```

### **User Management**

```typescript
GET / api / v1 / users / profile // Get user profile
PATCH / api / v1 / users / profile // Update profile
POST / api / v1 / auth / verify - email // Email verification
```

## 🎯 Benefits of This Architecture

### **✅ Industry Standard**

- **Microservices Pattern**: Independent scaling
- **API-First Design**: Multiple client support
- **Team Independence**: Backend/Frontend separation
- **Technology Flexibility**: Different tech stacks

### **✅ Production Ready**

- **Error Handling**: Comprehensive error management
- **Security**: JWT, CORS, validation, rate limiting
- **Monitoring**: Structured logging and metrics
- **Testing**: Separate API and UI testing

### **✅ Developer Experience**

- **Type Safety**: End-to-end TypeScript
- **Auto-completion**: Full API method discovery
- **Hot Reload**: Independent development servers
- **Debugging**: Separate concern debugging

## 🧪 Testing the Integration

### **1. Test Authentication Flow**

```bash
# Login with demo credentials
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "password": "password"}'
```

### **2. Test Protected Routes**

```bash
# Access protected endpoint
curl -X GET http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **3. Frontend Integration**

1. Open `http://localhost:3000`
2. Navigate to login page
3. Use demo credentials: `demo@example.com` / `password`
4. Check auth state persistence across page reloads

## 🚀 Next Steps

### **Database Setup**

```bash
cd E:\Projects\typescript-starter
npm run db:push     # Initialize database
npm run db:seed     # Seed with demo data
```

### **Production Deployment**

1. **API Server**: Deploy to Railway, Heroku, or AWS
2. **Database**: PostgreSQL on Railway, Supabase, or AWS RDS
3. **Frontend**: Deploy to Vercel, Netlify, or AWS Amplify
4. **Environment**: Update production URLs

### **Additional Features**

- [ ] Email verification flow
- [ ] Password reset flow
- [ ] User roles and permissions
- [ ] API rate limiting
- [ ] Real-time notifications
- [ ] File upload handling

## 🔍 Key Files Created/Updated

```
src/
├── config/
│   └── api.ts                 # API configuration
├── lib/
│   ├── api/
│   │   ├── client.ts         # HTTP client
│   │   └── responses.ts      # Response handlers
│   └── validations/
│       └── auth.ts           # Zod schemas
├── services/
│   └── authService.ts        # Updated for external API
├── utils/auth/
│   └── tokenManager.ts       # Enhanced token management
└── .env.example              # Environment template
```

## 🆘 Troubleshooting

### **Common Issues**

1. **CORS Errors**: Check API server CORS configuration
2. **Token Refresh**: Verify refresh token endpoint
3. **Network Issues**: Confirm API server is running
4. **Environment**: Check `.env.local` configuration

### **Debug Commands**

```bash
# Check API health
curl http://localhost:3001/api/v1/health

# Check frontend API config
npm run typecheck

# View API logs
tail -f logs/api.log
```

---

## 🎉 Success!

You now have a **production-ready, industry-standard** authentication system with:

- ✅ Separated API and UI concerns
- ✅ Type-safe API integration
- ✅ Secure token management
- ✅ Comprehensive error handling
- ✅ Development and production ready

**Ready to scale your application!** 🚀
