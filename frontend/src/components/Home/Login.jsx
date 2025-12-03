import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  // Custom Farm Illustration Image Component with Animation
  const AnimatedFarmIllustration = () => (
    <div className="farm-illustration-container animate-float-slow flex justify-center">
      <img
        src="illustration.png"
        alt="Farm Illustration"
        className="w-full max-w-[80px] lg:max-w-[120px] md:max-w-[120px] h-[100px] lg:h-[150px] mb-2"
      />
    </div>
  );

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-green-100 to-green-300 font-poppins overflow-hidden p-4 md:p-0">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
          
          .font-poppins { font-family: 'Poppins', sans-serif; }
          
          /* Simple floating animation for the entire illustration */
          .animate-float-slow { animation: float 6s infinite ease-in-out; }
          
          .animate-show { animation: show 0.6s; }

          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
          @keyframes show { 0%, 49.99% { opacity: 0; z-index: 1; } 50%, 100% { opacity: 1; z-index: 5; } }
        `}
      </style>
      <span className="block py-1 px-3 rounded-full bg-red-500/10 border border-red-500/20  text-red-500 text-sm font-semibold tracking-widest mb-1">
              <p>Note: This section is under development.</p>
            </span>
      <div
        className={`bg-white rounded-2xl md:rounded-xl shadow-xl md:shadow-2xl relative overflow-hidden w-full max-w-[400px] md:max-w-[768px] min-h-[600px] md:min-h-[480px] transition-all duration-300 ${
          isRightPanelActive ? 'right-panel-active' : ''
        }`}
      >
        
        {/* Sign Up Form */}
        <div
          className={`form-container sign-up-container absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 flex items-center justify-center 
            ${
              isRightPanelActive
                ? 'opacity-100 z-50 md:translate-x-full animate-show md:animate-none'
                : 'opacity-0 z-0 pointer-events-none md:pointer-events-auto'
            }`}
        >
          <form
            action="#"
            className="bg-white flex flex-col items-center justify-center h-full px-8 md:px-12 text-center w-full"
          >
            {/* Mobile Illustration */}
            <div className="md:hidden w-full mb-4">
               <AnimatedFarmIllustration />
            </div>

            <h1 className="font-bold m-0 text-green-800 text-2xl">
              Create Account
            </h1>
            <div className="social-container my-3 md:my-5">
              <a
                href="#"
                className="social border border-gray-300 rounded-full inline-flex justify-center items-center m-1 h-10 w-10 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-300"
              >
                G
              </a>
              <a
                href="#"
                className="social border border-gray-300 rounded-full inline-flex justify-center items-center m-1 h-10 w-10 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-300"
              >
                f
              </a>
              <a
                href="#"
                className="social border border-gray-300 rounded-full inline-flex justify-center items-center m-1 h-10 w-10 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-300"
              >
                in
              </a>
            </div>
            <span className="text-xs">or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="rounded-full border border-green-600 bg-green-600 text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none shadow-md mt-4">
              Sign Up
            </button>
            
            {/* Mobile Toggle */}
            <p className="md:hidden text-xs mt-6">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={handleSignInClick}
                className="text-green-600 font-bold bg-transparent border-none p-0 underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* Sign In Form */}
        <div
          className={`form-container sign-in-container absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 flex items-center justify-center z-10
            ${
              isRightPanelActive
                ? 'md:translate-x-full opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'
                : 'opacity-100'
            }`}
        >
          <form
            action="#"
            className="bg-white flex flex-col items-center justify-center h-full px-8 md:px-12 text-center w-full"
          >
            {/* Mobile Illustration */}
            <div className="md:hidden w-full mb-4">
               <AnimatedFarmIllustration />
            </div>

            <h1 className="font-bold m-0 text-green-800 text-2xl">Sign in</h1>
            <div className="social-container my-3 md:my-5">
              <a
                href="#"
                className="social border border-gray-300 rounded-full inline-flex justify-center items-center m-1 h-10 w-10 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-300"
              >
                G
              </a>
              <a
                href="#"
                className="social border border-gray-300 rounded-full inline-flex justify-center items-center m-1 h-10 w-10 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-300"
              >
                f
              </a>
              <a
                href="#"
                className="social border border-gray-300 rounded-full inline-flex justify-center items-center m-1 h-10 w-10 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors duration-300"
              >
                in
              </a>
            </div>
            <span className="text-xs">or use your account</span>
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-100 border-none p-3 my-2 w-full rounded transition-colors duration-300 focus:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <a
              href="#"
              className="text-gray-800 text-sm no-underline my-4 hover:text-green-700"
            >
              Forgot your password?
            </a>
            <Link to={'/dashboard'} className="rounded-full border border-green-600 bg-green-600 text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none shadow-md">
              Sign In
            </Link>

            {/* Mobile Toggle */}
            <p className="md:hidden text-xs mt-6">
              Don't have an account?{' '}
              <Link to={'/dashboard'} 
                type="button"
                onClick={handleSignUpClick}
                className="text-green-600 font-bold bg-transparent border-none p-0 underline cursor-pointer"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        {/* Overlay / Slider (Hidden on Mobile) */}
        <div
          className={`overlay-container hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 ${
            isRightPanelActive ? '-translate-x-full' : ''
          }`}
        >
          <div
            className={`overlay bg-gradient-to-r from-green-700 to-green-500 bg-no-repeat bg-cover bg-center text-white relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out ${
              isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'
            }`}
          >
            {/* Left Overlay Panel (Shows 'Welcome Back!' when signing up) */}
            <div
              className={`overlay-panel overlay-left absolute flex flex-col items-center justify-center p-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? 'translate-x-0' : '-translate-x-1/5'
              }`}
            >
              <AnimatedFarmIllustration />
              <h1 className="font-bold m-0 text-2xl">Welcome Back!</h1>
              <p className="text-sm font-light leading-5 tracking-wider my-5 px-8">
                To keep connected with your farm, please login with your
                personal info
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none shadow-md"
                onClick={handleSignInClick}
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Panel (Shows 'New Harvest?' when signing in) */}
            <div
              className={`overlay-panel overlay-right absolute flex flex-col items-center justify-center p-10 text-center top-0 h-full w-1/2 right-0 transform transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? 'translate-x-1/5' : 'translate-x-0'
              }`}
            >
              <AnimatedFarmIllustration />
              <h1 className="font-bold m-0 text-2xl">New Harvest?</h1>
              <p className="text-sm font-light leading-5 tracking-wider my-5 px-8">
                Enter your personal details and start your journey with us
              </p>
              <button
                className="ghost rounded-full border border-white bg-transparent text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-80 ease-in active:scale-95 focus:outline-none shadow-md"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;