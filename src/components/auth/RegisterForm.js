import Link from "next/link";

export default function RegisterForm(){
    return (
        <div>
            {/* TITLE */}
            <h1 className="text-2xl font-bold text-center mb-6 text-primary">Signup</h1>

            {/* EMAIL */}
            <input type="email" placeholder="Email" className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black" />

            {/* PASSWORD */}
            <input type="password" placeholder="Create Password" className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black" />

            {/* CONFIRM PASSWORD */}
            <input type="password" placeholder="Confirm Password" className="w-full mb-4 px-4 py-3 rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-black" />

            {/* BUTTON */}
            <button className="w-full border border-primary bg-primary text-white py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all mb-4 hover:border border-primary">Signup</button>

            {/* LOGIN */}
            <p className="text-center text-black mb-6">Already have an account? {" "}
                <Link href="/login" className="font-semibold text-primary">Login</Link>
            </p>

            {/* GOOGLE */}
            <button className="w-full border border-primary py-3 rounded-lg text-primary font-medium hover:bg-primary hover:text-white transition-all">Login with Google</button>
        </div>
    );
}