//{import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function RegisterForm() {

//   const [formData, setFormData] = useState({ username: "", email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:7000/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
      
//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Registration successful!");
//         navigate("/login");
//       } else {
//         setMessage(data.message || "Registration failed");
//       }
      
//     } catch (err) {
//       setMessage("Server error");
//       console.log(err)
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded">
//       <h2 className="text-xl font-bold text-center mb-4">Register</h2>
//       <input
//         name="username"
//         placeholder="Username"
//         value={formData.username}
//         onChange={handleChange}
//         className="w-full mb-3 p-2 border rounded"
//         required
//       />
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={handleChange}
//         className="w-full mb-3 p-2 border rounded"
//         required
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={handleChange}
//         className="w-full mb-3 p-2 border rounded"
//         required
//       />
//       <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
//         Register
//       </button>
//       {message && <p className="text-center mt-3 text-sm">{message}</p>}
//       <p className="text-center mt-2 text-sm">
//         Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>Login</span>
//       </p>
//     </form>
//   );

// }
//}



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { User, Mail, Lock, UserPlus, LogIn, Sparkles } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// // Validation Schema
// const registerSchema = z.object({
//   username: z.string().min(3, "Username must be at least 3 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// export default function RegisterForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch("http://localhost:7000/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const responseData = await res.json();

//       if (res.ok) {
//         toast.success("🎉 Registration successful! Redirecting to login...", {
//           position: "top-right",
//           autoClose: 2000,
//           theme: "colored",
//         });
//         setTimeout(() => navigate("/login"), 1500);
//       } else {
//         toast.error(responseData.message || "❌ Registration failed", {
//           position: "top-right",
//           autoClose: 3000,
//           theme: "colored",
//         });
//       }
//     } catch (err) {
//       toast.error(`Server error: ${err.message}`, {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "colored",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
//       <ToastContainer />

//       {/* Animated Background */}
//       <motion.div
//         className="absolute inset-0 overflow-hidden pointer-events-none"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <motion.div
//           className="absolute top-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
//           animate={{
//             scale: [1, 1.2, 1],
//             x: [0, -50, 0],
//             y: [0, 30, 0],
//           }}
//           transition={{
//             duration: 8,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//         <motion.div
//           className="absolute bottom-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
//           animate={{
//             scale: [1, 1.3, 1],
//             x: [0, 50, 0],
//             y: [0, -30, 0],
//           }}
//           transition={{
//             duration: 10,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       </motion.div>

//       {/* Register Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative w-full max-w-md"
//       >
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             className="text-center mb-8"
//           >
//             <motion.div
//               className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4"
//               whileHover={{ scale: 1.1, rotate: 360 }}
//               transition={{ duration: 0.6 }}
//             >
//               <Sparkles className="w-8 h-8 text-white" />
//             </motion.div>
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Create Account
//             </h2>
//             <p className="text-gray-600 mt-2">Start managing your tasks today</p>
//           </motion.div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* Username Field */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   {...register("username")}
//                   placeholder="johndoe"
//                   className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
//                     errors.username ? "border-red-500" : "border-gray-200"
//                   }`}
//                 />
//               </div>
//               {errors.username && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="text-red-500 text-sm mt-1"
//                 >
//                   {errors.username.message}
//                 </motion.p>
//               )}
//             </motion.div>

//             {/* Email Field */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   {...register("email")}
//                   placeholder="you@example.com"
//                   className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
//                     errors.email ? "border-red-500" : "border-gray-200"
//                   }`}
//                 />
//               </div>
//               {errors.email && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="text-red-500 text-sm mt-1"
//                 >
//                   {errors.email.message}
//                 </motion.p>
//               )}
//             </motion.div>

//             {/* Password Field */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.5 }}
//             >
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="password"
//                   {...register("password")}
//                   placeholder="••••••••"
//                   className={`w-full pl-11 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
//                     errors.password ? "border-red-500" : "border-gray-200"
//                   }`}
//                 />
//               </div>
//               {errors.password && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="text-red-500 text-sm mt-1"
//                 >
//                   {errors.password.message}
//                 </motion.p>
//               )}
//             </motion.div>

//             {/* Submit Button */}
//             <motion.button
//               type="submit"
//               disabled={isLoading}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                 />
//               ) : (
//                 <>
//                   <UserPlus className="w-5 h-5" />
//                   Create Account
//                 </>
//               )}
//             </motion.button>
//           </form>

//           {/* Login Link */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="mt-6 text-center"
//           >
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <button
//                 onClick={() => navigate("/login")}
//                 className="text-purple-600 hover:text-pink-600 font-semibold inline-flex items-center gap-1 transition-colors"
//               >
//                 <LogIn className="w-4 h-4" />
//                 Sign in
//               </button>
//             </p>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("http://localhost:7000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } else {
      setMessage(data.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-pink-400 to-blue-500 rounded-full flex items-center justify-center shadow">
            <span className="text-white text-2xl font-bold">✍️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Register</h2>
          <p className="text-gray-500 text-sm">Create your new account</p>
        </div>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-3 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-300 transition"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 transition"
          required
        />
        <button
          className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-r from-pink-400 to-blue-500 shadow hover:from-pink-500 hover:to-blue-700 transition"
        >
          Register
        </button>
        {message && (
          <p className="mt-4 text-center text-green-600 text-sm">{message}</p>
        )}
        <div className="text-center mt-4">
          <span className="text-gray-500">Already have an account? </span>
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
