"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, Phone, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
              My Profile
            </h1>
            <p className="text-white/60 text-lg">
              Manage your account information
            </p>
          </div>

          {/* Profile Card */}
          <div className="glass rounded-3xl p-8 md:p-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user?.fullName || "User"}
              </h2>
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/80 text-sm">
                {user?.role || "Customer"}
              </span>
            </div>

            {/* Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white/60 text-sm uppercase tracking-wider">
                    Email
                  </h3>
                </div>
                <p className="text-white text-lg ml-13">
                  {user?.email || "N/A"}
                </p>
              </div>

              {/* Phone */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-white/60 text-sm uppercase tracking-wider">
                    Phone Number
                  </h3>
                </div>
                <p className="text-white text-lg ml-13">
                  {user?.phoneNumber || "Not provided"}
                </p>
              </div>

              {/* User ID */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-white/60 text-sm uppercase tracking-wider">
                    User ID
                  </h3>
                </div>
                <p className="text-white text-lg ml-13 font-mono text-sm">
                  {user?.id || "N/A"}
                </p>
              </div>

              {/* Member Since */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-white/60 text-sm uppercase tracking-wider">
                    Member Since
                  </h3>
                </div>
                <p className="text-white text-lg ml-13">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 glass-card rounded-xl px-6 py-3 text-white hover:bg-white/10 transition-all duration-300">
                Edit Profile
              </button>
              <button className="flex-1 glass-card rounded-xl px-6 py-3 text-white hover:bg-white/10 transition-all duration-300">
                Change Password
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-white/40 text-sm">
            <p>Your profile information is securely stored and encrypted.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
