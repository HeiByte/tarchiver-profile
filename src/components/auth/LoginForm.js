import Link from "next/link";

export default function LoginForm() {
  return (
    <div>
      {/* TITLE */}
      <h1 className="text-3xl  font-bold mb-2 text-black">
        <span className="text-primary">Welcome</span> Back
      </h1>

      <p className="mb-8 text-black">Please enter your details</p>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
      />

      {/* PASSWORD */}
      <div className="relative mb-4">
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black"
        />
      </div>

      {/* FORGOT */}
      <div className="text-right mb-6">
        <Link href="#" className="text-primary text-sm hover:underline">
          Forgor Password?
        </Link>
      </div>

      {/* BUTTON */}
      <Link href="/dashboard">
      <button className="w-full bg-primary py-3 rounded-lg font-semibold hover:bg-white transition-all mb-6 hover:border border-primary hover:text-primary">
        Login
      </button>
      </Link>

      {/* SIGNUP */}
      <p className="text-center text-black mb-6">
        Don't hove an account?{" "}
        <Link href="#" className="font-semibold text-primary">
          Signup
        </Link>
      </p>

      {/* GOOGLE */}
      <button className="w-full border border-black py-3 rounded-lg text-black font-medium hover:bg-primary transition-all hover:text-white">
        Login with Google
      </button>
    </div>
  );
}
