import React, { useState, useEffect } from "react";
import { 
  Play, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Menu, 
  X, 
  Sprout, 
  CloudRain, 
  Tractor, 
  Smartphone, 
  BarChart3, 
  Wind, 
  Droplets,
  ArrowRight,
  Star,
  MapPin,
  ThermometerSun,
  Activity,
  TriangleAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

// --- Components ---


const Navbar = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "DASHBOARD", path: "/dashboard" },
    { name: "FARMS", path: "/farms" },
    { name: "WEATHER", path: "/weather" },
    { name: "SENSORS", path: "/sensors" },

  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/' ? "bg-zinc-950/90 backdrop-blur-md py-3 shadow-lg border-b border-zinc-800" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Sprout size={24} />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">
              Smart<span className="text-emerald-500">Kheti</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => (
            <Link key={item.name} to={item.path}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-emerald-400" 
                    : "text-zinc-300 hover:text-emerald-400"
                }`}
              >
                {item.name}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-lg shadow-emerald-900/20"
            >
              Get Started
            </motion.button>
          </Link>
          
          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-zinc-900 border-b border-zinc-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-left font-medium ${
                    isActive(item.path) ? "text-emerald-400" : "text-zinc-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-emerald-600 rounded-lg text-white font-bold text-center"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-colors group"
  >
    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-emerald-900/30 transition-colors">
      <Icon className="text-emerald-500" size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const StatBlock = ({ value, label }) => (
  <div className="text-center">
    <h4 className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</h4>
    <p className="text-emerald-500 text-sm font-medium tracking-wider uppercase">{label}</p>
  </div>
);

const TestimonialCard = ({ data }) => (
  <div className="w-[350px] md:w-[450px] p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex-shrink-0 hover:bg-zinc-900 hover:border-emerald-500/30 transition-all duration-300">
    <div className="flex gap-1 text-emerald-500 mb-6">
      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
    </div>
    <p className="text-zinc-300 mb-8 text-lg italic leading-relaxed">"{data.content}"</p>
    <div className="flex items-center gap-4 border-t border-zinc-800 pt-6">
      <img src={data.image} alt={data.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20" />
      <div>
        <h4 className="text-white font-bold text-sm md:text-base">{data.name}</h4>
        <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider">{data.role}</p>
      </div>
    </div>
  </div>
);


// --- Dummy Page Components ---




// --- Landing Page Content ---

const LandingPage = ({ onNavigate }) => {
    const testimonialsData = [
        {
          name: "Rajesh Kumar",
          role: "Wheat Farmer, Punjab",
          content: "Since using SmartKheti, my water usage dropped by 40% while my yield increased. The automated irrigation is a lifesaver.",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
        },
        {
          name: "Sarah Jenkins",
          role: "Vineyard Owner, California",
          content: "The frost prediction alerts saved my entire harvest last season. The precision of the sensors is unmatched.",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
        },
        {
          name: "Miguel Rodriguez",
          role: "Organic Farmer, Spain",
          content: "I can monitor my soil health from anywhere. It's like having an expert agronomist in my pocket 24/7.",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
        },
        {
          name: "Anita Desai",
          role: "Cotton Farmer, Gujarat",
          content: "SmartKheti's insights helped me optimize my fertilizer usage, saving costs and protecting the soil.",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
        },
         {
          name: "David Chen",
          role: "Rice Farmer, Taiwan",
          content: "The dashboard is so easy to use. Even my father, who isn't tech-savvy, checks the weather data daily.",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop"
        }
    ];

  return (
    <>
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image/Video Fallback */}
        <div className="absolute inset-0 z-0">
           
         <video
        src="/farm-video.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 min-w-screen h-100% object-cover -z-20"
      />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
          <div>
            
          </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             <span className="block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20  text-red-200 text-sm font-semibold tracking-widest mb-1">
              <p>Note: You have to Connect IoT Device to see the data and functionalities in Dashboard and all other pages.</p>
            </span>
             <span className="block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20  text-red-200 text-sm font-semibold tracking-widest mb-4">
              <p>Note: This website is still in development. Some features may not work as expected.</p>
            </span>
            
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-widest mb-6">
              THE FUTURE OF AGRICULTURE
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Cultivate Smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Harvest Better.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Empowering farmers with precision IoT data, AI-driven insights, and automated irrigation. 
              Protect your legacy while embracing the future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login"
                onClick={() => onNavigate('')}
                className="px-8 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center hover:scale-105 hover: gap-2 cursor-pointer"
              >
                Start Your Journey <ArrowRight size={20} />
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border border-zinc-600 text-white font-semibold hover:border-emerald-500 transition-all flex items-center gap-2 cursor-pointer"
                 onClick={() => window.open("https://youtu.be/1Mz3P98ETB0", "_blank")}

              >
                <Play size={18} fill="currentColor" /> Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Scroll</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-12 rounded-full bg-gradient-to-b from-emerald-500 to-transparent"
          />
        </motion.div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-10 border-b border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBlock value="15k+" label="Active Farmers" />
          <StatBlock value="30%" label="Water Saved" />
          <StatBlock value="24/7" label="Monitoring" />
          <StatBlock value="4.9" label="User Rating" />
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-24 bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Precision at your fingertips</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We combine hardware sensors with software intelligence to give you complete control over your fields.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Smartphone}
              title="Real-Time Monitoring"
              desc="Check soil moisture, temperature, and crop health instantly from your smartphone, anywhere in the world."
              delay={0}
            />
            <FeatureCard 
              icon={CloudRain}
              title="Smart Irrigation"
              desc="Automate water cycles based on weather forecasts and actual soil needs, reducing waste and cost."
              delay={0.2}
            />
            <FeatureCard 
              icon={BarChart3}
              title="Yield Analytics"
              desc="Historical data and AI predictions help you plan harvest cycles for maximum profitability."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* --- IMMERSIVE SECTION --- */}
      <section className="py-24 bg-zinc-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <h2 className="text-4xl font-bold text-white leading-tight">
              Designed for the <br />
              <span className="text-emerald-500">Modern Farmer</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Farming isn't just a job; it's a science. Smart-Kheti bridges the gap between traditional wisdom and modern technology.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Wind, text: "Weather Alerts & Storm Prediction" },
                { icon: Droplets, text: "Precise NPK & Moisture Sensors" },
                { icon: Tractor, text: "Automated Machinery Integration" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="bg-emerald-900/30 p-3 rounded-full text-emerald-400">
                    <item.icon size={20} />
                  </div>
                  <span className="text-zinc-200 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <button 
                onClick={() => onNavigate('dashboard')}
                className="mt-8 px-8 py-3 bg-white text-zinc-900 rounded-full font-bold hover:bg-zinc-200 transition-colors"
            >
              Explore The Dashboard
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative"
          >
            {/* Abstract UI Representation */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">
              <img 
                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop" 
                alt="Farmer with Tablet" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md p-6 border-t border-zinc-700">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase mb-1">Field Status</p>
                    <p className="text-emerald-400 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Optimal Conditions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400 mb-1">Soil Moisture</p>
                    <p className="text-white font-mono text-xl">68%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

       <section className="py-24 bg-zinc-950 overflow-hidden relative">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Trusted by Farmers Globally</h2>
        <p className="text-zinc-400 text-lg">Join thousands of growers optimizing their harvest with SmartKheti.</p>
      </div>

      <div className="relative w-full group">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="flex w-max animate-marquee">
          {/* First Set */}
          <div className="flex gap-8 px-4">
            {testimonialsData.map((data, i) => (
              <TestimonialCard key={`a-${i}`} data={data} />
            ))}
          </div>
          {/* Duplicate Set for Loop */}
          <div className="flex gap-8 px-4">
            {testimonialsData.map((data, i) => (
              <TestimonialCard key={`b-${i}`} data={data} />
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black pt-20 pb-10 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                 <div className="bg-emerald-600 p-1.5 rounded text-white">
                  <Sprout size={18} />
                </div>
                <span className="text-xl font-bold text-white">SmartKheti</span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Empowering the hands that feed the world. Smart technology for sustainable agriculture.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Platform</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Overview</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Hardware</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-zinc-500 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
              <div className="flex gap-4 mb-6">
                <a href="#" className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all"><Twitter size={18} /></a>
                <a href="#" className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all"><Facebook size={18} /></a>
                <a href="#" className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all"><Linkedin size={18} /></a>
                <a href="#" className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all"><Instagram size={18} /></a>
              </div>
              <p className="text-zinc-600 text-xs">© {new Date().getFullYear()} Smart-Kheti Inc.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

// --- Main App Component ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
        case 'dashboard': return <DashboardPage />;
        case 'farms': return <FarmsPage />;
        case 'weather': return <WeatherPage />;
        case 'sensors': return <SensorsPage />;
        default: return <LandingPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Navbar isScrolled={isScrolled} activePage={activePage} onNavigate={setActivePage} />
      {renderPage()}
    </div>
  );
}