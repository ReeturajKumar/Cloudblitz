/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      toast.success("Account created successfully!");
      navigate("/login"); // Now this will work properly
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80')",
        }}
      >
        <div className="absolute bottom-8 left-8 text-white space-y-2 max-w-xs md:max-w-sm">
          <p className="text-base md:text-lg font-semibold italic leading-snug drop-shadow-md">
            “Empower your team with CloudBlitz CRM.”
          </p>
          <p className="text-sm font-light opacity-90">
            — New Era of Enquiry Management
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gradient-to-br from-sky-100 via-white to-indigo-100">
        <div className="w-full max-w-sm sm:max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Join CloudBlitz and start managing enquiries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="pb-2">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="pb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="pb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 cursor-pointer transition-all duration-200"
            >
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-gray-400 text-sm">OR</p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Disabled Social Icons */}
          <div className="flex justify-center gap-5 opacity-50 cursor-not-allowed">
            <FaGoogle size={22} />
            <FaFacebookF size={22} />
            <FaTwitter size={22} />
          </div>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
