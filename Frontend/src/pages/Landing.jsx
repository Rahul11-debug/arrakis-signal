import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-20 shadow-2xl text-center max-w-xl w-full">
        
        <h1 className="text-5xl font-extrabold text-white mb-12">
          Arrakis Signal
        </h1>

        <p className="text-indigo-100 text-lg mb-10">
          A modern civic complaint platform for transparent, fast and accountable governance.
        </p>

        <div className="flex justify-center gap-12">
          
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl bg-white text-indigo-700 font-semibold shadow-md hover:scale-105 transition-all duration-200"
          >
            Register
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl bg-indigo-700 text-white font-semibold shadow-md hover:bg-indigo-800 transition-all duration-200"
          >
            Login
          </button>

        </div>

      </div>
    </div>
  );
}
