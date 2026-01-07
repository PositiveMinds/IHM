# HealthFlow Mobile App

React Native (Expo) mobile app for multi-facility healthcare with GitHub OAuth and n8n AI integration.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `.env` with:
- `EXPO_PUBLIC_BACKEND_URL` - Your Node.js backend URL (e.g., http://localhost:3000)

### 3. Backend Setup
Your backend must:
1. Accept `POST /auth/login` with `{ email, password }`
2. Query Google Sheets Users table for email
3. Verify password hash (bcrypt)
4. Return `{ success: true, token, user, facilities }`

### 4. Run App

**Web:**
```bash
npm start -- --web
```

**Android:**
```bash
npm start -- --android
```

**iOS:**
```bash
npm start -- --ios
```

## Project Structure

```
HealthFlow-Mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   └── AnalysisScreen.js
│   └── services/
│       ├── authService.js
│       └── api.js
├── App.js
├── app.json
├── package.json
└── .env
```

## Features

- **Email/Password Login** - Authenticate against Google Sheets users
- **Multi-Facility Support** - Switch between assigned facilities
- **Dashboard** - View facility statistics
- **AI Analysis** - Submit patient data to n8n for AI processing
- **Secure Storage** - Encrypted token storage via Expo SecureStore

## API Endpoints

### Backend Integration Points

```
POST /auth/login
  Input: { email, password }
  Output: { success: true, token, user: { email }, facilities: [{ facility_id, role }] }

GET /dashboard/:facilityId
  Headers: Authorization: Bearer {token}
  Output: { totalPatients, activeCases, ... }

POST /analyze
  Body: { facilityId, patientData }
  Output: { analysis, recommendations, ... }
```

## Connecting to Backend

The app expects a Node.js backend that:

1. Validates email/password against Google Sheets (Users sheet)
2. Returns JWT token with facility assignments
3. Queries Google Sheets for dashboard data
4. Triggers n8n webhooks for patient analysis

**Google Sheets Structure:**
```
Users Sheet:
  - email (A)
  - password_hash (B) - bcrypt hash
  - facility_id (C)
  - role (D) - admin, doctor, nurse
```

See parent directory for backend setup.

## Security Notes

- Tokens stored in Expo SecureStore (encrypted)
- Token validation on app resume
- Automatic logout on token expiration
- CORS headers from backend required

## Future Enhancements

- Patient list view with search
- Patient records detail page
- Offline sync with Google Sheets
- Biometric login
- Push notifications from n8n
