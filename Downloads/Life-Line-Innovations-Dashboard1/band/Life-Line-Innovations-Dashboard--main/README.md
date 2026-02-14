# Life Band – Real-Time Health Monitoring Dashboard

A professional medical dashboard web application for real-time stress and health monitoring. Pure static — no build tools, no npm, no server required.

## Quick Start

**Just open `index.html` in any browser.** That's it.

## Demo Credentials

| Portal | Email | Password |
|--------|-------|----------|
| Individual | `user@lifeband.com` | `password123` |
| Corporate | `hr@lifeband.com` | `corporate123` |

## Project Structure

```
life-band-app/
├── index.html                  # Splash + landing page
├── individual-login.html       # Individual login/signup
├── corporate-login.html        # Corporate HR login
├── onboarding.html             # 3-step user onboarding
├── dashboard.html              # Main health dashboard
├── history.html                # Health data history
├── suggestions.html            # AI health suggestions
├── doctor.html                 # Doctor recommendations
├── profile.html                # User profile management
├── corporate-dashboard.html    # Corporate employee overview
├── corporate-alerts.html       # Corporate alert management
├── corporate-reports.html      # Report generation + PDF
├── about.html                  # About page
├── how-it-works.html           # How it works
├── contact.html                # Contact form
├── css/
│   └── styles.css              # Custom styles + animations
├── js/
│   ├── auth.js                 # Authentication & navigation
│   ├── storage.js              # Mock data engine & localStorage
│   ├── charts.js               # Chart.js configuration
│   └── animations.js           # Lottie & animation helpers
└── assets/
    └── logo.png                # Logo image
```

## Tech Stack (all CDN, zero installs)

| Library | Purpose |
|---------|---------|
| Tailwind CSS | Utility-first styling |
| Chart.js 4.4 | Dashboard charts |
| jsPDF + AutoTable | PDF report generation |
| Lottie Web | Animation engine |
| Lucide Icons | Icon system |
| Google Fonts (Inter) | Typography |

## Features

- Sidebar dashboard layout with medical SaaS appearance
- Real-time health metrics (stress, BP, heart rate, SpO2)
- Interactive Chart.js graphs with gradient fills
- PDF export for health reports and corporate analytics
- localStorage-based data persistence
- Mock data generation engine
- Progressive onboarding flow
- Corporate employee wellness monitoring
- Alert management with resolve actions
- Responsive design with mobile sidebar

## Data Storage

All data is stored in `localStorage`:
- `lifeBand_user` — Session/auth
- `lifeBand_profile` — User profile
- `lifeBand_readings` — Health readings
- `lifeBand_onboarded` — Onboarding status

---

*"Stress doesn't send warnings. Life Band does."*


2. **Verify Installation:**
   ```powershell
   node --version
   npm --version
   ```

## 🚀 Installation & Setup

### 1. Navigate to Project Directory

```powershell
cd "C:\Users\vicky\OneDrive\Desktop\Life Line Innovations\life-band-app"
```

### 2. Install Dependencies

```powershell
npm install
```

Or if you prefer yarn:
```powershell
yarn install
```

Or if you prefer pnpm:
```powershell
pnpm install
```

### 3. Run Development Server

```powershell
npm run dev
```

Or:
```powershell
yarn dev
```

Or:
```powershell
pnpm dev
```

### 4. Open in Browser

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔐 Demo Credentials

### Individual User
- **Email:** `user@example.com`
- **Password:** `password123`

### Corporate/HR User
- **Email:** `hr@company.com`
- **Password:** `corporate123`

## 📝 Project Structure

```
life-band-app/
├── app/                          # Next.js App Router pages
│   ├── about/                    # About page
│   ├── choose/                   # User type selection page
│   ├── contact/                  # Contact page
│   ├── corporate/                # Corporate dashboard pages
│   │   ├── alerts/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── reports/
│   │   └── support/
│   ├── how-it-works/            # How it works page
│   ├── individual/              # Individual user pages
│   │   ├── dashboard/
│   │   ├── find-doctor/
│   │   ├── history/
│   │   ├── login/
│   │   ├── onboarding/
│   │   ├── profile/
│   │   └── suggestions/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage (logo animation)
├── components/                   # Reusable components
│   ├── CorporateNav.tsx
│   └── IndividualNav.tsx
├── lib/                         # Utility functions
│   ├── mockData.ts              # Mock data for development
│   └── utils.ts                 # Helper functions
├── store/                       # State management
│   └── authStore.ts             # Authentication store (Zustand)
├── types/                       # TypeScript type definitions
│   └── index.ts
├── public/                      # Static assets (place logo here)
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🎨 Customization

### Adding Your Logo

1. Place your logo file (PNG/SVG) in the `/public` folder
2. Update the logo references in:
   - `/app/page.tsx` (homepage animation)
   - `/app/choose/page.tsx` (main landing)
   - Navigation components

### Modifying Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  medical: {
    blue: '#0066CC',      // Primary brand color
    lightBlue: '#E6F2FF', // Light background
    red: '#DC2626',       // Alerts/warnings
    green: '#10B981',     // Success states
    gray: '#F3F4F6',      // Neutral background
  }
}
```

### Connecting to Real Backend API

Replace mock data in `/lib/mockData.ts` with actual API calls:

```typescript
// Example:
export const fetchHealthData = async () => {
  const response = await fetch('/api/health-data');
  return response.json();
};
```

## 📦 Building for Production

### 1. Build the Application

```powershell
npm run build
```

### 2. Start Production Server

```powershell
npm run start
```

### 3. Deploy (Optional)

**Recommended:** Deploy to Vercel (optimized for Next.js)

1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Deploy:
   ```powershell
   vercel
   ```

**Alternative platforms:**
- **Netlify** - Great for static sites
- **AWS Amplify** - Scalable cloud hosting
- **DigitalOcean App Platform** - Simple deployment

## 🔌 Adding Real-time Features

To implement real-time health monitoring:

1. **Install Socket.io:**
   ```powershell
   npm install socket.io-client
   ```

2. **Set up WebSocket connection:**
   ```typescript
   import io from 'socket.io-client';
   const socket = io('your-backend-url');
   ```

3. **Listen for health updates:**
   ```typescript
   socket.on('health-update', (data) => {
     // Update UI with real-time data
   });
   ```

## 📊 Implementing PDF Export

The PDF export buttons are placeholders. To implement:

1. Already installed: `jspdf` and `jspdf-autotable`

2. Create PDF generator utility:
   ```typescript
   import jsPDF from 'jspdf';
   import autoTable from 'jspdf-autotable';

   export const generateHealthReport = (data) => {
     const doc = new jsPDF();
     // Add content to PDF
     doc.save('health-report.pdf');
   };
   ```

## 🧪 Testing

### Run Linter

```powershell
npm run lint
```

### Future: Add Tests

```powershell
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

```powershell
# Use a different port
npm run dev -- -p 3001
```

### Module Not Found Errors

```powershell
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Build Errors

```powershell
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📘 Documentation

- **Next.js:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Recharts:** https://recharts.org/
- **Zustand:** https://github.com/pmndrs/zustand

## 🤝 Support

For questions or issues:
- **Email:** support@lifeband.com
- **Documentation:** See this README
- **GitHub Issues:** Create an issue in the repository

## 📄 License

This project is proprietary software owned by Life Line Innovations.

## 🚀 Next Steps

1. ✅ Install Node.js
2. ✅ Install dependencies (`npm install`)
3. ✅ Run development server (`npm run dev`)
4. 🔄 Add your logo to `/public` folder
5. 🔄 Connect to real backend API
6. 🔄 Implement PDF export functionality
7. 🔄 Add real-time WebSocket connection
8. 🔄 Deploy to production

---

**Built with ❤️ by Life Line Innovations Team**

*"Stress doesn't send warnings. Life Band does."*
