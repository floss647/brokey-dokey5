import React, { useState, useEffect } from 'react';

// --- 0. ERROR BOUNDARY (CATCHES BLANK SCREENS) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8 font-sans">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-xl border-2 border-red-500">
            <h1 className="text-3xl font-black text-red-600 mb-4">⚠️ The App Crashed</h1>
            <p className="mb-4 text-gray-700">Here is the error details (share this with the developer):</p>
            <div className="bg-gray-100 p-4 rounded overflow-auto font-mono text-sm text-red-800 mb-6">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-6 py-3 font-bold rounded-lg hover:bg-red-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- 1. GLOBAL STYLES ---
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Chakra+Petch:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

        .font-brutalist { font-family: 'Space Grotesk', sans-serif; }
        .font-modern { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'Chakra Petch', sans-serif; }
        
        .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { 
            0% { opacity: 0; transform: translateY(10px); } 
            100% { opacity: 1; transform: translateY(0); } 
        }
        
        .animate-level-up { animation: levelUp 0.5s ease-in-out; }
        @keyframes levelUp { 0% { transform: scale(1); } 50% { transform: scale(1.1) rotate(2deg); } 100% { transform: scale(1); } }

        .brutalist-shadow { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
        .brutalist-shadow-sm { box-shadow: 2px 2px 0px 0px rgba(0,0,0,1); }
        .brutalist-shadow-hover:hover { transform: translate(2px, 2px); box-shadow: 1px 1px 0px 0px rgba(0,0,0,1); }
        .custom-scrollbar::-webkit-scrollbar { height: 0px; background: transparent; }
    `}</style>
);

// --- 2. ICONS ---
const Icon = ({ path, className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{path}</svg>;
const Icons = {
    Search: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
    Menu: (props) => <Icon {...props} path={<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>} />,
    Plus: (props) => <Icon {...props} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />,
    Wrench: (props) => <Icon {...props} path={<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>} />,
    ArrowLeft: (props) => <Icon {...props} path={<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>} />,
    Heart: (props) => <Icon {...props} path={<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>} />,
    MessageCircle: (props) => <Icon {...props} path={<><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>} />,
    AlertTriangle: (props) => <Icon {...props} path={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
    Sparkles: (props) => <Icon {...props} path={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></>} />,
    Loader2: (props) => <Icon {...props} path={<><path d="M21 12a9 9 0 1 1-6.219-8.56"/></>} />,
    Link: (props) => <Icon {...props} path={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />,
    Upload: (props) => <Icon {...props} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />,
    X: (props) => <Icon {...props} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />,
    Bot: (props) => <Icon {...props} path={<><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></>} />,
    TrendingUp: (props) => <Icon {...props} path={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,
    Palette: (props) => <Icon {...props} path={<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></>} />,
    User: (props) => <Icon {...props} path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
    CheckCircle: (props) => <Icon {...props} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />,
    Send: (props) => <Icon {...props} path={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>} />,
    SearchSmall: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
    Users: (props) => <Icon {...props} path={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
    Trophy: (props) => <Icon {...props} path={<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17"/><path d="M14 14.66V17"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>} />,
    ShoppingBag: (props) => <Icon {...props} path={<><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>} />,
    Ghost: (props) => <Icon {...props} path={<><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></>} />,
    Copy: (props) => <Icon {...props} path={<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>} />,
    Edit: (props) => <Icon {...props} path={<><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>} />,
    Save: (props) => <Icon {...props} path={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />,
    Briefcase: (props) => <Icon {...props} path={<><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>} />,
    Dollar: (props) => <Icon {...props} path={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />,
    Megaphone: (props) => <Icon {...props} path={<><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>} />,
    Tag: (props) => <Icon {...props} path={<><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></>} />,
    Target: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />,
    Shield: (props) => <Icon {...props} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>} />,
    Camera: (props) => <Icon {...props} path={<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>} />,
    Recycle: (props) => <Icon {...props} path={<><polyline points="7 19 7 9 17 19 17 9"/><path d="M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10z"/></>} />,
    Zap: (props) => <Icon {...props} path={<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>} />,
    MapPin: (props) => <Icon {...props} path={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>} />,
    Star: (props) => <Icon {...props} path={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>} />,
    Leaf: (props) => <Icon {...props} path={<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></>} />,
    Gift: (props) => <Icon {...props} path={<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></>} />,
    Building: (props) => <Icon {...props} path={<><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></>} />,
    Share: (props) => <Icon {...props} path={<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></>} />,
    Tv: (props) => <Icon {...props} path={<><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></>} />,
    Smartphone: (props) => <Icon {...props} path={<><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>} />,
    Handshake: (props) => <Icon {...props} path={<><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-1.42-1.42l4-4a1 1 0 0 1 1.41 0l2.17 2.17a3 3 0 0 0 4.24 0l2.17-2.17a1 1 0 0 1 1.41 0l4 4a1 1 0 1 1-1.42 1.42l-.88.88a3 3 0 0 0 0 4.24l3.88 3.88a1 1 0 1 0 3-3L24 22l-2-2"/></>} />,
    PieChart: (props) => <Icon {...props} path={<><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>} />,
    BarChart: (props) => <Icon {...props} path={<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>} />
};

// --- 3. THEMED BUTTON & COMPONENTS ---
const ThemedButton = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, theme = 'brutalist' }) => {
    const isModern = theme === 'modern';
    const baseStyles = isModern 
        ? "font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 rounded-full"
        : "font-bold uppercase border-2 border-black transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 rounded-lg";
    const variants = {
        primary: isModern ? "bg-black text-white hover:bg-gray-800 shadow-md px-6 py-2" : "bg-yellow-400 hover:bg-yellow-300 text-black brutalist-shadow-sm px-4 py-2",
        secondary: isModern ? "bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-sm px-6 py-2" : "bg-white hover:bg-gray-50 text-black brutalist-shadow-sm px-4 py-2",
        black: isModern ? "bg-black text-white hover:bg-gray-800 shadow-lg px-6 py-3" : "bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] px-4 py-2",
        purple: isModern ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md px-4 py-2" : "bg-purple-200 hover:bg-purple-300 text-purple-900 border-purple-900 brutalist-shadow-sm px-4 py-2",
        blue: isModern ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md px-4 py-2" : "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-900 brutalist-shadow-sm px-4 py-2",
        green: isModern ? "bg-green-500 text-white hover:bg-green-600 shadow-md px-4 py-2" : "bg-green-300 hover:bg-green-400 text-black border-black brutalist-shadow-sm px-4 py-2",
        orange: isModern ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md px-4 py-2" : "bg-orange-100 hover:bg-orange-200 text-orange-900 border-orange-900 brutalist-shadow-sm px-4 py-2",
        pink: isModern ? "bg-pink-500 text-white hover:bg-pink-600 shadow-md px-4 py-2" : "bg-pink-100 hover:bg-pink-200 text-pink-900 border-pink-900 brutalist-shadow-sm px-4 py-2",
        red: isModern ? "bg-red-500 text-white hover:bg-red-600 shadow-md px-4 py-2" : "bg-red-200 hover:bg-red-300 text-red-900 border-red-900 brutalist-shadow-sm px-4 py-2",
        ghost: isModern ? "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-black" : "bg-transparent border-none shadow-none hover:bg-gray-200"
    };
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{children}</button>;
};

const BrutalistButton = (props) => <ThemedButton {...props} theme="brutalist" />;

const Tag = ({ children, color = 'bg-white', theme = 'brutalist' }) => {
    const isModern = theme === 'modern';
    const style = isModern 
        ? `px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800`
        : `${color} border-2 border-black px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md`;
    return <span className={style}>{children}</span>;
};

// --- 4. DATA ---
const CATEGORIES = ["Consoles", "Phones & Tablets", "Laptops", "PC Components", "Audio", "Cameras", "Retro Games", "VR Headsets", "Drones"];
const CATEGORY_WEIGHTS = { 
    "Consoles": 3.5, "Phones & Tablets": 0.2, "Laptops": 2.0, "PC Components": 1.0, 
    "Audio": 0.5, "Cameras": 0.8, "Retro Games": 0.2, "VR Headsets": 0.8, "Drones": 1.5, "Handhelds": 0.5
};
const SHIPPING_RATES = { base: 2.99, perKg: 1.50 };

const MOCK_LISTINGS = [
    { id: '1', title: 'NINTENDO SWITCH LITE - DRIFT GOD', price: 45.00, image: 'https://images.unsplash.com/photo-1578303512597-81de837554e2?auto=format&fit=crop&q=80&w=600', difficulty: 'Easy', condition: 'Drift', category: 'Handhelds', description: "Left stick has a mind of its own.", seller: "RetroRick", location: "Manchester, UK", sellerRating: 4.8, reviews: 124 },
    { id: '2', title: 'MacBook Pro 2015 - Screen Glitch', price: 120.00, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=600', difficulty: 'Expert', condition: 'Screen Fault', category: 'Laptops', description: "Screen flickers purple. HDMI out works fine. No SSD.", seller: "BigDave88", location: "London, UK", sellerRating: 4.2, reviews: 15 },
    { id: '3', title: 'RTX 3080 - ARTIFACT CITY', price: 150.00, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600', difficulty: 'Expert', condition: 'Overheating', category: 'PC Components', description: "Shows space invaders.", seller: "MinerMike", location: "Birmingham, UK", sellerRating: 5.0, reviews: 4 },
];

const INITIAL_ADS = [
    { id: 'ad1', type: 'ad', title: 'iFixit Pro Tech Toolkit', price: '59.99', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600', difficulty: 'Tool', condition: 'New', category: 'Tools', description: 'Everything you need to fix your gear.', seller: 'iFixit (Sponsored)', status: 'Active', budget: 500, spent: 124.50, impressions: 4520, clicks: 142, ctr: '3.1%', location: "Global Shipping", sellerRating: 4.9, reviews: 5200 },
];

const MOCK_FORUM_THREADS = [
    { id: 1, title: "PS5 HDMI Port Replacement", author: "SolderingNoob", replies: 12, category: "Repair Help", views: 340, content: "I've ripped the pads off my PS5 HDMI port." },
    { id: 2, title: "GameBoy restoration!", author: "RetroKing", replies: 45, category: "Showcase", views: 1200, content: "Found this in a muddy puddle." },
];

const INITIAL_BOUNTIES = [
    { id: 'b1', brand: 'Apple', title: 'iPhone 12 Rescue', reward: '£5 Credit', desc: 'Fix iPhone 12 devices.', logo: '🍎', color: 'bg-gray-100', expires: '28 days' },
    { id: 'b2', brand: 'Samsung', title: 'Galaxy S21 Screen', reward: '£10 Credit', desc: 'Harvest working screens.', logo: 'S', color: 'bg-blue-50', expires: '14 days' },
];

const MOCK_SCOUT_RESULTS = [
    { id: 'e1', title: 'PS4 PRO - FAULTY DISK DRIVE', price: '45.00', listed: '28 days ago', profit: '£60', link: 'ebay.com/itm/123' },
    { id: 'e2', title: 'Nintendo Switch Lite - No Power', price: '30.00', listed: '15 days ago', profit: '£45', link: 'ebay.com/itm/456' },
];

const MOCK_REWARDS = [
     { id: 'r1', title: 'Back Market Voucher', cost: 100, icon: <Icons.Recycle className="w-5 h-5"/>, desc: '£20 Towards Refurb Tech', partner: 'Back Market' },
     { id: 'r2', title: 'Currys Trade-In Boost', cost: 50, icon: <Icons.Zap className="w-5 h-5"/>, desc: '+10% Value on Trade-ins', partner: 'Currys' },
     { id: 'r3', title: 'Patagonia Repair', cost: 50, icon: <Icons.Leaf className="w-5 h-5"/>, desc: '£15 Off Worn Wear Repairs', partner: 'Patagonia' },
     { id: 'r4', title: 'Listing Boost', cost: 10, icon: <Icons.TrendingUp className="w-5 h-5"/>, desc: 'Push your items to top.', partner: 'BrokeyDokey' }
];

const TRADE_OFFERS = [
    { id: 't1', partner: 'Back Market', amount: 20, desc: 'Credit for any refurb phone', icon: <Icons.Recycle className="w-4 h-4"/>, color: 'bg-green-100' },
    { id: 't2', partner: 'Currys', amount: 15, desc: 'In-store tech voucher', icon: <Icons.Zap className="w-4 h-4"/>, color: 'bg-purple-100' },
    { id: 't3', partner: 'Patagonia', amount: 25, desc: 'Worn Wear credit', icon: <Icons.Leaf className="w-4 h-4"/>, color: 'bg-orange-100' },
];

const MOCK_LEADERBOARD_INDIVIDUAL = [
     { rank: 1, name: "RepairWizard", score: 840.5, tag: "Master Technician" },
     { rank: 2, name: "CircuitBreaker", score: 620.2, tag: "Repair God" },
     { rank: 3, name: "ScrapMaster (You)", score: 12.5, tag: "Landfill Lurker" }, 
     { rank: 4, name: "NoSolderNoCry", score: 125.0, tag: "Soldering Sage" },
     { rank: 5, name: "RefurbRick", score: 98.4, tag: "Component Collector" }
];

const MOCK_LEADERBOARD_CORP = [
    { rank: 1, name: "TechCorp Inc", score: 5400.2, tag: "Platinum Partner" },
    { rank: 2, name: "GreenSchool Ltd", score: 2100.5, tag: "Gold Partner" },
    { rank: 3, name: "City Council IT", score: 1800.0, tag: "Silver Partner" },
];

// --- 5. PAGE COMPONENTS (Ordered dependencies) ---

const Hero = ({ theme, onViewChange }) => {
    const isModern = theme === 'modern';
    return (
        <div className={`mb-12 fade-in ${isModern ? 'text-center' : ''}`}>
            <div className={`${isModern ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl shadow-xl p-12' : 'bg-[#ff90e8] border-4 border-black p-8 brutalist-shadow rounded-xl'} relative overflow-hidden`}>
                 <div className="relative z-10">
                    <h1 className={`text-5xl md:text-7xl mb-4 ${isModern ? 'font-bold tracking-tight' : 'font-black uppercase italic leading-[0.9]'}`}>
                        Don't Bin It. <br/><span className={isModern ? 'text-yellow-300' : 'text-white text-stroke-black'}>Bank It.</span>
                    </h1>
                    <p className={`text-xl max-w-lg mb-8 ${isModern ? 'mx-auto opacity-90' : 'font-bold border-l-4 border-black pl-4'}`}>
                        The marketplace for broken tech. Turn your electronic junk into cash, spare parts, and planet-saving points.
                    </p>
                    <div className={`flex gap-4 ${isModern ? 'justify-center' : ''}`}>
                        <ThemedButton theme={theme} variant={isModern ? 'secondary' : 'black'} onClick={() => onViewChange('sell')} className="text-lg px-8">Start Selling</ThemedButton>
                        <ThemedButton theme={theme} variant={isModern ? 'primary' : 'secondary'} onClick={() => onViewChange('feed')} className="text-lg px-8">Explore Parts</ThemedButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImpactDashboard = ({ theme, totalSaved }) => {
    const isModern = theme === 'modern';
    return (
         <div className={`p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 ${isModern ? 'bg-green-900 text-white rounded-2xl shadow-lg' : 'bg-green-400 border-4 border-black brutalist-shadow rounded-xl'}`}>
            <div className="flex items-center gap-6">
                <div className={`p-4 ${isModern ? 'bg-white/10 rounded-full' : 'bg-white border-2 border-black rounded-lg'}`}>
                    <Icons.Recycle className={`w-12 h-12 ${isModern ? 'text-white' : 'text-black'}`} />
                </div>
                <div>
                    <div className={`text-4xl ${isModern ? 'font-bold' : 'font-black font-tech'}`}>{totalSaved.toLocaleString()}kg</div>
                    <div className="font-bold uppercase tracking-widest text-sm opacity-80">E-Waste Diverted</div>
                </div>
            </div>
            <div className="h-12 w-px bg-current opacity-20 hidden md:block"></div>
            <div className="flex items-center gap-6">
                <div>
                    <div className={`text-4xl ${isModern ? 'font-bold' : 'font-black font-tech'}`}>£42.5k</div>
                    <div className="font-bold uppercase tracking-widest text-sm opacity-80">Paid to Sellers</div>
                </div>
                 <div className={`p-4 ${isModern ? 'bg-white/10 rounded-full' : 'bg-white border-2 border-black rounded-lg'}`}>
                    <Icons.Zap className={`w-12 h-12 ${isModern ? 'text-white' : 'text-black'}`} />
                </div>
            </div>
        </div>
    );
};

const AuthView = ({ onLogin, onSignup, theme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', handle: '', email: '', password: '', type: 'user' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(formData);
        } else {
            if (!formData.name || !formData.email || !formData.password) return alert("Please fill all fields");
            onSignup(formData);
        }
    };

    const isModern = theme === 'modern';

    return (
        <div className={`flex items-center justify-center min-h-[80vh] fade-in ${isModern ? 'font-modern' : ''}`}>
            <div className={`max-w-md w-full p-8 ${isModern ? 'bg-white rounded-2xl shadow-xl border border-gray-100' : 'bg-white border-4 border-black brutalist-shadow rounded-xl'}`}>
                <div className="text-center mb-8">
                    <h1 className={`text-3xl ${isModern ? 'font-bold' : 'font-black uppercase italic'}`}>
                        {isLogin ? 'Welcome Back' : 'Join the Scrapyard'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input type="text" placeholder="Full Name" className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="text" placeholder="Handle (@username)" className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`} value={formData.handle} onChange={e => setFormData({...formData, handle: e.target.value})} />
                        </>
                    )}
                    <input type="email" placeholder="Email Address" className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <ThemedButton theme={theme} type="submit" variant="black" className="w-full py-3 text-lg">
                        {isLogin ? 'Log In' : 'Create Account'}
                    </ThemedButton>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-xs text-gray-400 font-bold uppercase text-center mb-2">Dev Tools</div>
                    <ThemedButton theme={theme} variant="secondary" className="w-full text-xs" onClick={() => onLogin({ email: 'demo', type: 'user' })}>⚡ Quick Login as Demo User</ThemedButton>
                </div>
            </div>
        </div>
    );
};

const BusinessDashboard = ({ onCreateBounty, onCreateAd, activeAds, theme }) => {
    const [campaignType, setCampaignType] = useState('bounty');
    // Simplified logic for brevity, using provided props
    return (
         <div className={`max-w-5xl mx-auto p-4 fade-in space-y-6 ${theme === 'modern' ? 'font-modern' : ''}`}>
             <div className="bg-blue-900 text-white p-8 border-4 border-black brutalist-shadow rounded-xl">
                 <h1 className="text-4xl font-black uppercase italic mb-2">Pro Partner Portal</h1>
                 <p>Simulated Dashboard for B2B Partners</p>
             </div>
             <div className="bg-white border-2 border-black p-6 rounded-xl">
                 <h3 className="text-xl font-black uppercase mb-4">Live Campaigns</h3>
                 {activeAds.map(ad => <div key={ad.id} className="p-2 border-b">{ad.title} ({ad.status})</div>)}
             </div>
             <div className="bg-white p-6 border-2 border-black rounded-xl">
                 <h3 className="text-xl font-black">Launch Campaign</h3>
                 <div className="flex gap-2 mt-4">
                     <ThemedButton theme={theme} onClick={() => alert('Bounty Logic')}>New Bounty</ThemedButton>
                     <ThemedButton theme={theme} onClick={() => alert('Ad Logic')}>New Ad</ThemedButton>
                 </div>
             </div>
         </div>
    );
};

const InvestorDeck = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 animate-in fade-in space-y-12 pb-20">
            <section className="text-center space-y-6 py-12 border-b-4 border-black">
                <div className="inline-block bg-black text-white px-4 py-1 font-bold uppercase text-sm mb-4 transform -rotate-2">Investor Portal</div>
                <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none">Liquidity Layer for the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">Circular Economy</span></h1>
            </section>
             <section className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase"><Icons.Zap className="inline w-8 h-8 mb-1"/> The Friction Problem</h2>
                    <p className="font-medium text-lg">eBay is too risky. Recycling is unrewarding. Binning it is easy.</p>
                </div>
            </section>
        </div>
    );
};

const ListingCard = ({ item, onClick, theme }) => {
    const isAd = item.type === 'ad';
    const isDonation = item.type === 'donation';
    const isModern = theme === 'modern';
    return (
        <div onClick={() => onClick(item)} className={`bg-white transition-all duration-200 cursor-pointer group flex flex-col h-full relative ${isModern ? 'rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden' : 'border-2 border-black brutalist-shadow rounded-xl'} ${isAd ? (isModern ? 'border-blue-200 bg-blue-50' : 'border-blue-600') : ''}`}>
            <div className="absolute top-2 left-2 z-10">
                {isAd ? <Tag theme={theme} color="bg-blue-200">SPONSORED</Tag> : isDonation ? <Tag theme={theme} color="bg-purple-200">FREE / TRADE</Tag> : <Tag theme={theme} color={item.difficulty === 'Easy' ? 'bg-green-300' : 'bg-yellow-300'}>{item.difficulty}</Tag>}
            </div>
            <div className={`relative aspect-square bg-gray-100 overflow-hidden ${!isModern && 'border-b-2 border-black rounded-t-xl'}`}>
                <img src={item.image} alt={item.title} className={`w-full h-full object-cover transition-transform duration-500 ${!isAd && 'grayscale group-hover:grayscale-0'}`} />
                <div className={`absolute bottom-0 right-0 px-3 py-1 font-mono font-bold ${isModern ? 'bg-white/90 backdrop-blur text-black m-2 rounded-lg shadow-sm' : 'bg-black text-white border-l-2 border-t-2 border-black rounded-tl-lg'}`}>{isAd ? `£${item.price}` : (item.price > 0 ? `£${Number(item.price).toFixed(2)}` : 'JUST SHIPPING')}</div>
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
                <h3 className={`text-lg leading-tight mb-2 line-clamp-2 ${isModern ? 'font-bold text-gray-900' : 'font-black uppercase'}`}>{item.title}</h3>
                <div className={`flex justify-between items-center mt-2 pt-2 ${isModern ? 'border-t border-gray-100' : 'border-t-2 border-gray-100'}`}>
                    <span className="text-xs font-bold text-gray-400">@{item.seller}</span>
                </div>
            </div>
        </div>
    );
};

// --- SELL PAGE (Fixed for Object Errors) ---
const SellPage = ({ onCancel, onPost, theme }) => {
    const isModern = theme === 'modern';
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [generatedDesc, setGeneratedDesc] = useState('');
    const [category, setCategory] = useState('Consoles');
    const [instantOffer, setInstantOffer] = useState(null);
    const [showInstantModal, setShowInstantModal] = useState(false);
    const [sellType, setSellType] = useState('cash');

    useEffect(() => {
        if (!title) { setInstantOffer(null); return; }
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('iphone 12') || lowerTitle.includes('iphone 13')) {
            setInstantOffer({ partner: 'MusicMagpie', price: 180.00, logo: 'M', color: 'bg-blue-600', textColor: 'text-white' });
        } else if (lowerTitle.includes('ps5')) {
             setInstantOffer({ partner: 'Mazuma', price: 120.00, logo: 'Z', color: 'bg-orange-500', textColor: 'text-white' });
        } else { setInstantOffer(null); }
    }, [title]);

    const handlePost = () => {
        if(!title) return alert("Title required");
        const newItem = {
            id: Date.now().toString(),
            title,
            price: parseFloat(price) || 0,
            description: generatedDesc,
            category,
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600',
            difficulty: 'Intermediate', condition: 'Broken', status: 'active', seller: 'You', location: 'Unknown', shippingType: 'ship', shippingCost: 3.99, paidBy: 'buyer', type: 'listing'
        };
        onPost(newItem);
    };

    return (
        <div className={`max-w-2xl mx-auto p-4 fade-in ${isModern ? 'font-modern' : ''}`}>
             {showInstantModal && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-black p-6 max-w-md w-full brutalist-shadow relative rounded-xl text-center">
                        <Icons.Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                        <h2 className="text-3xl font-black uppercase italic mb-2">Instant Cash Offer!</h2>
                        <div className="bg-gray-100 p-6 rounded-xl border-2 border-black mb-6">
                            <div className="text-xl font-bold mb-4">{title}</div>
                            <div className="font-black text-3xl text-green-600">£{instantOffer?.price}</div>
                        </div>
                        <button onClick={() => setShowInstantModal(false)} className="text-sm font-bold text-gray-500 hover:text-black underline">No thanks</button>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4 mb-8">
                <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-all"><Icons.ArrowLeft className="w-6 h-6" /></button>
                <h1 className={`text-3xl ${isModern ? 'font-bold' : 'font-black uppercase italic'}`}>List Your Broken Gear</h1>
            </div>

            <div className={`p-6 space-y-8 ${isModern ? 'bg-white rounded-2xl shadow-sm border border-gray-200' : 'bg-white border-2 border-black brutalist-shadow-sm rounded-xl'}`}>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="font-bold uppercase text-sm block">What are you selling?</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Broken iPhone 12 (Triggers Instant Offer)" className={`w-full p-4 font-bold text-lg focus:outline-none ${isModern ? 'rounded-xl border border-gray-300' : 'border-2 border-black rounded-lg'}`} />
                    </div>
                    
                    {instantOffer && (
                        <div className={`animate-in fade-in p-4 border-2 border-green-500 bg-green-50 flex justify-between items-center ${isModern ? 'rounded-xl' : 'rounded-lg shadow-[4px_4px_0px_0px_#22c55e]'}`}>
                            <div><div className="font-bold text-lg leading-tight">Sell to {instantOffer.partner}</div></div>
                            <div className="text-right"><div className="text-2xl font-black text-green-700">£{instantOffer.price}</div><button onClick={() => setShowInstantModal(true)} className="bg-black text-white text-xs font-bold uppercase px-3 py-1.5 mt-1 hover:bg-gray-800 transition-colors rounded">View Offer</button></div>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                         <label className="font-bold uppercase text-sm block">Price (£)</label>
                         <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={`w-full p-3 font-mono focus:outline-none ${isModern ? 'rounded-xl border border-gray-300' : 'border-2 border-black rounded-lg'}`} />
                    </div>
                </div>
                <ThemedButton theme={theme} className="w-full py-4 text-lg mt-4" onClick={handlePost}>Post Listing</ThemedButton>
            </div>
        </div>
    );
};

const DetailView = ({ activeItem, goHome, onRescueInitiate, onChatInitiate, showToast, theme, isSaved, onToggleSave }) => {
    // Basic detail view for brevity in fixed code
    const isModern = theme === 'modern';
    return (
        <div className="max-w-5xl mx-auto fade-in">
            <button onClick={goHome} className="mb-6 flex items-center gap-2 font-bold hover:underline"><Icons.ArrowLeft className="w-4 h-4"/> Back</button>
            <div className="bg-white border-2 border-black p-6 rounded-xl">
                 <h1 className="text-3xl font-black mb-4">{activeItem.title}</h1>
                 <p className="mb-6">{activeItem.description}</p>
                 <div className="flex gap-4">
                     <ThemedButton theme={theme} onClick={() => onRescueInitiate(activeItem)}>Rescue</ThemedButton>
                 </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user, onMarkSoldInitiate, showToast, onSpendPoints, onActivateBounty, onClaimBounty, onUpdateUser, theme, onLogout, onToggleSave }) => { 
    return <div className="text-center font-bold p-10">Profile View Placeholder (Active User: {user.name})</div>;
};

const ForumView = ({ showToast, theme }) => {
    return <div className="text-center font-bold p-10">Forum Placeholder</div>;
};

const InventoryScout = ({ showToast }) => {
    return <div className="text-center font-bold p-10">Inventory Scout Placeholder</div>;
};

const DemoControls = ({ user, setUser, setView }) => {
    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            <div className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded-t-lg">Demo Controls</div>
            <div className="bg-white border-2 border-black p-2 rounded-b-lg rounded-tr-lg shadow-lg flex flex-col gap-2">
                <button onClick={() => { setUser(null); setView('feed'); }} className="text-xs font-bold text-left hover:bg-gray-100 p-1 rounded">👤 Guest</button>
                <button onClick={() => { setUser({ name: "ScrapMaster", handle: "scrap_daddy", impactScore: 12.5, listings: MOCK_LISTINGS.slice(0,1), rescued: [], activeBounties: [], saved: [], type: 'user' }); setView('feed'); }} className="text-xs font-bold text-left hover:bg-gray-100 p-1 rounded">🔧 Fixer</button>
            </div>
        </div>
    );
};

// --- APP CONTENT WRAPPER ---
const AppContent = () => {
    const [view, setView] = useState('feed'); 
    const [theme, setTheme] = useState('brutalist');
    const [user, setUser] = useState({ name: "ScrapMaster", handle: "scrap_daddy", impactScore: 12.5, listings: MOCK_LISTINGS.slice(0,1), rescued: [], activeBounties: [], saved: [] });
    const [activeItem, setActiveItem] = useState(null);
    
    // Auth helpers
    const handleLogin = () => { setUser({ name: "ScrapMaster", handle: "scrap_daddy", impactScore: 12.5, listings: MOCK_LISTINGS.slice(0,1), rescued: [], activeBounties: [], saved: [] }); setView('feed'); };
    const requireAuth = (target) => { if(!user) setView('auth'); else setView(target); };
    const handlePost = (item) => { setUser({...user, listings: [item, ...user.listings]}); setView('feed'); };
    const onRescueInitiate = (item) => { setActiveItem(item); alert('Rescue Initiated!'); };

    return (
        <div className={`min-h-screen pb-20 relative ${theme === 'modern' ? 'bg-gray-50 font-modern' : 'bg-[#f0f0f0] font-brutalist'}`}>
            <GlobalStyles />
            <DemoControls user={user} setUser={setUser} setView={setView} />
            <nav className={`sticky top-0 z-40 px-4 py-3 flex justify-between items-center ${theme === 'modern' ? 'bg-white/80 backdrop-blur border-b border-gray-200' : 'bg-white border-b-4 border-black'}`}>
                 <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('feed')}>
                    <div className={`p-2 bg-black text-white ${theme === 'modern' ? 'rounded-lg' : ''}`}><Icons.Wrench className="w-6 h-6"/></div>
                    <span className={`text-2xl ${theme === 'modern' ? 'font-bold' : 'font-black uppercase italic hidden md:block'}`}>BrokeyDokey</span>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => setView('investor')} className="text-xs font-bold uppercase border-2 border-black px-3 py-1 bg-yellow-400 hover:bg-yellow-300">Investors</button>
                     <ThemedButton theme={theme} onClick={() => requireAuth('sell')} className="px-3 py-1 text-sm"><Icons.Plus className="w-4 h-4"/> Sell</ThemedButton>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {view === 'auth' && <AuthView onLogin={handleLogin} onSignup={handleLogin} theme={theme} />}
                {view === 'feed' && <Hero theme={theme} onViewChange={setView} />}
                {view === 'feed' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        {MOCK_LISTINGS.map((item, i) => (
                            <ListingCard key={i} item={item} theme={theme} onClick={() => { setActiveItem(item); setView('detail'); }} />
                        ))}
                    </div>
                )}
                {view === 'detail' && activeItem && <DetailView activeItem={activeItem} goHome={() => setView('feed')} onRescueInitiate={onRescueInitiate} theme={theme} />}
                {view === 'sell' && <SellPage onCancel={() => setView('feed')} onPost={handlePost} theme={theme} />}
                {view === 'investor' && <InvestorDeck />}
                {view === 'profile' && <ProfileView user={user} theme={theme} />}
            </main>
        </div>
    );
};

export default function App() {
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    );
}