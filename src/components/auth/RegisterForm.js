"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // validasi
        if (password !== confirmPassword) {
            return setError ("Password tidak sama");
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ email, password }),  
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Register gagal");
            }

            console.log("Register success:", data);

            //nanti bisa direct ke login
            //router.push("/login");
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* TITLE */}
            <h1 className="text-2xl font-bold text-center mb-6 text-primary">Signup</h1>

            {/* EMAIL */}
            <input type="email" placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black" />

            {/* PASSWORD */}
            <input type="password" placeholder="Create Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black" />

            {/* CONFIRM PASSWORD */}
            <input type="password" placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black" />

            {/* ERROR */}
            {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {/* BUTTON */}
            <button 
            type="submit"
            disabled={loading}
            className="w-full border border-primary bg-primary text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all mb-4 hover:border border-primary">{loading ? "Loading..." : "Signup"}</button>

            {/* LOGIN */}
            <p className="text-center text-black mb-6">Already have an account? {" "}
                <Link href="/login" className="font-semibold text-primary">Login</Link>
            </p>

            {/* GOOGLE */}
            <button 
            type="button"
            className="w-full border border-primary py-3 rounded-lg text-primary font-medium hover:bg-primary hover:text-white transition-all">Login with Google</button>
        </form>
    );
}