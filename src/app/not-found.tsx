// pages/404.js
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-5xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 max-w-md mb-6 text-center">
        Oops! It looks like you’ve wandered off the map. The page you’re looking
        for doesn’t exist or has been moved.
      </p>
      <Image
        src="/404-error.png"
        alt="404 Error"
        width={300}
        height={300}
        className="mb-8"
      />
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
}