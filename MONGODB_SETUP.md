# MongoDB Atlas Setup Guide for Demo

## Quick Setup for Your Demo Video

### Option 1: Use Existing MongoDB Atlas (if you have one)
1. Go to your MongoDB Atlas dashboard
2. Get your connection string
3. Replace in `server/.env`:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/customer-portal?retryWrites=true&w=majority
   ```

### Option 2: Create New MongoDB Atlas (Free Tier)
1. Go to https://www.mongodb.com/atlas
2. Sign up for free account
3. Create a new cluster (M0 Sandbox - Free)
4. Create database user:
   - Username: `customerportal`
   - Password: `SecurePass123`
5. Add IP address: `0.0.0.0/0` (for demo only)
6. Get connection string and update `.env`

### Option 3: Quick Local Setup for Demo
If you prefer local database for demo:
1. Install MongoDB Community locally
2. Update `.env` to:
   ```
   MONGO_URI=mongodb://localhost:27017/customer-portal
   ```

## Current Status
Your `.env` file has placeholder credentials that need to be replaced with real ones for the application to work.

**Question:** Do you have existing MongoDB Atlas credentials, or should I help you set up a new free account for the demo?
