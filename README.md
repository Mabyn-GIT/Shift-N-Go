# ShiftNgo - Second-Hand Car Selling Platform

A modern, full-stack web application for ShiftNgo, a second-hand car showroom that sells certified used cars. Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Public Website (Customer-Facing)

- **Modern Showroom UI**: Glassmorphic design with premium aesthetics
- **Dynamic Car Inventory**: Real-time car listings from Supabase
- **Advanced Filtering**: Filter by fuel type, transmission, price, year, kilometers, owners, and brand
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Interactive Car Details**: Modal with image slider and comprehensive specifications
- **Contact Integration**: WhatsApp and call buttons throughout the site
- **Professional Sections**: Hero, Why Choose Us, Contact information

### Admin Panel (Secure & User-Friendly)

- **Supabase Authentication**: Secure email/password login
- **Car Upload Form**: Intuitive form for non-technical users
- **Image Management**: Multiple image upload with preview and compression
- **Car Management**: View, edit, and delete car listings
- **Car Description Support**: Rich text descriptions for each vehicle
- **Real-time Updates**: Instant reflection of changes on the public site

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── CarManagement.tsx
│   │   └── CarUploadForm.tsx
│   ├── Cars/
│   │   ├── CarCard.tsx
│   │   ├── CarGrid.tsx
│   │   ├── CarModal.tsx
│   │   └── FilterPanel.tsx
│   ├── Home/
│   │   ├── Contact.tsx
│   │   ├── Hero.tsx
│   │   └── WhyShiftNgo.tsx
│   └── Layout/
│       ├── FloatingButtons.tsx
│       ├── Footer.tsx
│       └── Header.tsx
├── hooks/
│   └── useCars.ts
├── lib/
│   └── firebase.ts
├── pages/
│   ├── Admin.tsx
│   └── Home.tsx
├── types/
│   └── index.ts
├── App.tsx
├── index.css
└── main.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd shiftngo-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Get your Firebase configuration

4. **Configure environment variables**

```bash
cp .env.example .env
```

Fill in your Firebase configuration in the `.env` file.

5. **Update Firebase configuration**
   Edit `src/lib/firebase.ts` with your Firebase project details.

6. **Start development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Setting up Firebase

1. **Authentication**

   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Email/Password authentication
   - Create admin user accounts

2. **Firestore Database**

   - Create a collection named `cars`
   - Set up security rules (example provided below)

3. **Storage**
   - Enable Firebase Storage
   - Create a folder structure for car images

### Sample Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cars collection - public read, admin write
    match /cars/{carId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Usage

### Public Website

- Visit the homepage to browse available cars
- Use filters to narrow down search results
- Click on any car to view detailed information
- Use WhatsApp or call buttons to contact the showroom

### Admin Panel

- Navigate to `/admin`
- Login with Firebase credentials
- Upload new cars with images and specifications
- Manage existing car listings
- View analytics (coming soon)

## 🎨 Design Features

- **Glassmorphism**: Modern glass-like UI elements
- **Responsive Grid**: Adapts to all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Professional Typography**: Inter font for readability
- **Color System**: Consistent blue/purple gradient theme
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🔧 Customization

### Adding New Car Brands

Edit the `brands` array in `src/components/Admin/CarUploadForm.tsx`:

```javascript
const brands = ["Maruti Suzuki", "Hyundai", "Honda", "Your New Brand"];
```

### Modifying Contact Information

Update contact details in:

- `src/components/Layout/FloatingButtons.tsx`
- `src/components/Home/Contact.tsx`
- `src/components/Layout/Footer.tsx`

### Styling Changes

All styling is done with Tailwind CSS. Key files:

- `src/index.css` - Global styles and custom animations
- `tailwind.config.js` - Theme configuration

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Render

1. Push your code to GitHub
2. Create a new Web Service in Render
3. Connect your GitHub repository
4. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Environment Variables: Add your Supabase URL and Anon Key
5. Click Deploy

**Important:** For Render deployment, make sure your Vite configuration has proper host binding:

```js
// vite.config.ts
server: {
  host: '0.0.0.0',
  port: 3000
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@shiftngo.com or create an issue in the repository.

---

Built with ❤️ for ShiftNgo - Making car buying simple and trustworthy.
