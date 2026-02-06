# PC Builder App - Deployment Guide

This guide will help you deploy the PC Builder demo app as a standalone web application accessible via URL.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

1. **Prepare Repository**
   ```bash
   # Create a new repository on GitHub
   # Push your code to the repository
   git init
   git add .
   git commit -m "Initial PC Builder app"
   git remote add origin https://github.com/YOUR_USERNAME/pc-builder-app.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect React and deploy instantly
   - Your app will be live at: `https://your-app-name.vercel.app`

3. **Set Up Supabase Backend**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy your project URL and keys
   - In Vercel dashboard → Settings → Environment Variables, add:
     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

4. **Deploy Backend Functions**
   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login

   # Link to your project
   supabase link --project-ref YOUR_PROJECT_ID

   # Deploy edge functions
   supabase functions deploy
   ```

### Option 2: Netlify

1. **Deploy Frontend**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your build folder, or connect GitHub repo
   - Set build command: `npm run build`
   - Set publish directory: `dist` or `build`

2. **Add Environment Variables**
   - Site Settings → Environment Variables
   - Add the same Supabase variables as above

### Option 3: Local Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Your app will be available at http://localhost:3000
```

## 🔧 Backend Setup (Supabase)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Wait for setup to complete

### 2. Update Connection Info
Update `/utils/supabase/info.tsx` with your project details:
```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

### 3. Deploy Edge Functions
```bash
# Make sure you're in the project root
supabase functions deploy server --project-ref YOUR_PROJECT_ID
```

### 4. Enable Authentication
- In Supabase Dashboard → Authentication → Settings
- Configure sign-up settings
- Optionally set up social providers (Google, GitHub, etc.)

## 🎯 Demo Features Available

Once deployed, your app will have:

### ✅ Core PC Building
- 8 component categories (CPU, GPU, motherboard, memory, storage, PSU, case, cooling)
- Real-time compatibility checking
- Performance metrics and benchmarking
- Smart recommendations

### ✅ Community Features
- User authentication (including demo account)
- Build saving and sharing
- Community leaderboards
- Performance rankings
- Social features (likes, views)

### ✅ Demo Account Access
Users can immediately try the app with:
- **Email**: `demo@pcbuilder.com`
- **Password**: `demo123`
- Pre-loaded with 3 sample builds
- Full community features enabled

## 🌐 Access Your Live App

After deployment, users can:

1. **Visit your app URL** (e.g., `https://your-app-name.vercel.app`)
2. **Try demo account** - Click "Use Demo Account" or sign in with demo credentials
3. **Create new account** - Sign up for personal build saving
4. **Build PCs** - Use all features without authentication required for core functionality

## 📱 Mobile & Desktop Ready

The app is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS Safari, Android Chrome)
- Tablets

## 🔒 Environment Variables Required

For full functionality, set these in your hosting platform:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```

## 🚨 Important Notes

1. **Demo Data**: The backend automatically creates demo user and sample builds on first run
2. **Fallback Mode**: Core PC building works even if backend is unavailable
3. **Authentication**: Demo account provides immediate access to all features
4. **Performance**: App includes real game benchmarking data for popular titles

## 📞 Support

The app includes:
- Error handling with helpful messages
- Offline mode for core features
- Demo account for immediate testing
- Community features with sample data

Your PC Builder app will be fully functional and ready for users to build PCs, compete on leaderboards, and explore the community features!