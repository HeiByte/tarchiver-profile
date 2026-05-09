import Image from "next/image";
import gambar7 from "@/assets/gambar7.jpg";

export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden grid md:grid-cols-2">
        {/* LEFT */}
        <div className="p-10 md:p-16 flex flex-col items-center justify-center">
          {children}
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src={gambar7}
            alt="image-login"
            className="max-h-[80%] w-auto obejct-contain rounded-3xl"
          />
        </div>
      </div>
    </div>
  );
}
