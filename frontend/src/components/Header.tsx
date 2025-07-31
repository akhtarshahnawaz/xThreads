'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Empty div to balance layout */}
      <div className="w-1/3" />

      {/* Centered Navigation Buttons */}
      <div className="w-1/3 flex justify-center gap-4 text-base font-medium">
        <Link
          href="/swap"
          className={`px-4 py-2 rounded-lg transition-colors ${
            pathname === '/swap'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Swap
        </Link>
        <Link
          href="/resolve"
          className={`px-4 py-2 rounded-lg transition-colors ${
            pathname === '/resolve'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Resolve
        </Link>
      </div>

      {/* Wallet Button */}
      <div className="w-1/3 flex justify-end">
        <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
