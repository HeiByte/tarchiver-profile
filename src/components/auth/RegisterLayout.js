export default function RegisterLayout({ children }) {
  return (
    <div className="min-h-screen flex item-center justify-center bg-white px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {children}
      </div>
    </div>
  );
}
