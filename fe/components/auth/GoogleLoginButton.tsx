
"use client";

import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoogleLoginButtonProps {
    className?: string;
    label?: string;
}

export function GoogleLoginButton({ className, label = "Continue with Google" }: GoogleLoginButtonProps) {
    const { login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                // In a real app, you would send tokenResponse.access_token or a code to your backend
                // For this demo, we assume the backend takes the access token as the idToken placeholder
                // or you would use the 'auth-code' flow.
                const response = await authService.loginWithGoogle(tokenResponse.access_token);
                if (response.accessToken) {
                    await login(response.accessToken, response.refreshToken);
                    router.push("/");
                }
            } catch (error) {
                console.error("Google Login Error:", error);
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            console.error("Login Failed");
            setIsLoading(false);
        },
    });

    return (
        <motion.button
            whileHover={{
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                backgroundColor: "rgba(255, 255, 255, 0.08)"
            }}
            whileTap={{
                boxShadow: "0 0 40px rgba(255, 255, 255, 0.3)",
                scale: 0.98,
                backgroundColor: "rgba(255, 255, 255, 0.12)"
            }}
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className={cn(
                "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full border border-white/10 bg-white/5 transition-colors disabled:opacity-50 disabled:pointer-events-none group relative overflow-hidden",
                className
            )}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                        />
                    </svg>
                    <span className="text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                        {label}
                    </span>
                </>
            )}
        </motion.button>
    );
}
