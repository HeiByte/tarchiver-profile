"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {method: "POST", headers : {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok){
      throw new Error (data.message || "Login Gagal");
    }

    console.log ("Login success:", data);

    // TODO: redirect ke dashboard
    // router.push ("/dashboard")

    } catch (err) {
      setError(err.message);
    }finally{
      setLoading(false);
    }
  };


  return (
    <form onSubmit = {handleSubmit}>
      {/* TITLE */}
      <h1 className="text-3xl  font-bold mb-2 text-black">
        <span className="text-primary">Welcome</span> Back
      </h1>

      <p className="mb-8 text-black">Please enter your details</p>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
      />

      {/* PASSWORD */}
      <div className="relative mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
        />
      </div>

      {/* ERROR */}
      {error && (<p className="text-red-500 text-sm mb-4">{error}</p>)}

      {/* FORGOT */}
      <div className="text-right mb-6">
        <Link href="#" className="text-primary text-sm hover:underline">
          Forgor Password?
        </Link>
      </div>

      {/* BUTTON */}
      <Link href="/dashboard">
        <button type="submit" className="w-full border border-primary bg-primary py-3 rounded-lg font-semibold hover:bg-white transition-all mb-6 hover:border border-primary hover:text-primary">
          {loading ? "Loading...." : "Login"}
        </button>
      </Link>

      {/* SIGNUP */}
      <p className="text-center text-black mb-6">
        Don't hove an account?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Signup
        </Link>
      </p>

      {/* GOOGLE */}
      <button type="button" className="w-full border border-black py-3 rounded-lg text-black font-medium hover:bg-primary transition-all hover:text-white">
        Login with Google
      </button>
    </form>
  );
}
