
import React from 'react';
import { GoogleIcon, HeartIcon } from './Icons';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-rose-100 via-orange-100 to-yellow-100 p-4">
      <div className="text-center w-full max-w-md">
        <div className="inline-block p-4 bg-white/50 rounded-full shadow-lg mb-6">
          <HeartIcon className="w-12 h-12 text-rose-500" />
        </div>
        <h1 className="font-display text-6xl font-bold text-rose-800">Fleur</h1>
        <p className="mt-4 text-lg text-gray-600">Find your person, delicately.</p>
        
        <div className="mt-12 space-y-4">
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <GoogleIcon className="w-6 h-6" />
            Continue with Google
          </button>
          
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/70 text-gray-800 placeholder-gray-500 py-3 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
            />
            <button
              type="submit"
              className="mt-4 w-full bg-gradient-to-r from-rose-500 to-orange-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              Send Magic Link
            </button>
          </form>
        </div>
        <p className="mt-8 text-xs text-gray-500">
          By continuing, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
