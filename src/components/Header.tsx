'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockUser } from '../data/mockData';

export default function Header() {
    const [user] = useState(mockUser);

    return (
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-pink-500 text-3xl font-bold">🐱</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Cute or Not
                    </span>
                </Link>

                <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
                        Home
                    </Link>
                    <Link href="/trending" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
                        Trending
                    </Link>
                    <Link href="/create" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
                        Create Meme
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Balance: </span>
                        <span className="font-bold text-green-600 dark:text-green-400">${user.balance.toFixed(2)}</span>
                    </div>

                    <div className="relative group">
                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                            {user.username.charAt(0).toUpperCase()}
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                <p className="font-medium text-gray-800 dark:text-gray-200">{user.username}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Balance: ${user.balance.toFixed(2)}</p>
                            </div>
                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Profile
                            </Link>
                            <Link href="/portfolio" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Portfolio
                            </Link>
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
} 