'use client';

import { useState } from 'react';
import { mockUser, mockTrades } from '../../data/mockData';
import { Trade } from '../../types';

export default function ProfilePage() {
    const [user, setUser] = useState(mockUser);
    const [activeTab, setActiveTab] = useState<'trades' | 'portfolio'>('trades');

    const userTrades = mockTrades.filter(trade => trade.userId === user.id);

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-32"></div>
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 -mt-16">
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-3xl font-bold border-4 border-white dark:border-gray-800">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="mt-4 sm:mt-0 text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Member since {new Date().getFullYear()}</p>
                        <div className="mt-4 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg inline-block">
                            <span className="text-gray-600 dark:text-gray-400">Balance: </span>
                            <span className="font-bold text-green-600 dark:text-green-400">${user.balance.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex">
                        <button
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'trades'
                                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('trades')}
                        >
                            Recent Trades
                        </button>
                        <button
                            className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'portfolio'
                                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            onClick={() => setActiveTab('portfolio')}
                        >
                            Portfolio
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'trades' && (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Recent Trades</h2>

                            {userTrades.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">You haven't made any trades yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                                <th className="pb-2 text-left">Meme ID</th>
                                                <th className="pb-2 text-left">Type</th>
                                                <th className="pb-2 text-right">Amount</th>
                                                <th className="pb-2 text-right">Price</th>
                                                <th className="pb-2 text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userTrades.map(trade => (
                                                <tr key={trade.id} className="border-b border-gray-100 dark:border-gray-800">
                                                    <td className="py-3 text-gray-800 dark:text-gray-200">{trade.memeId}</td>
                                                    <td className="py-3">
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${trade.type === 'CUTE'
                                                                ? 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
                                                                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                                            }`}>
                                                            {trade.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right text-gray-800 dark:text-gray-200">{trade.amount}</td>
                                                    <td className="py-3 text-right text-gray-800 dark:text-gray-200">${trade.price.toFixed(2)}</td>
                                                    <td className="py-3 text-right text-gray-800 dark:text-gray-200">{formatDate(trade.timestamp)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'portfolio' && (
                        <>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Portfolio</h2>

                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    This is a mock interface. In a real application, this would show your portfolio of CUTE and NOT CUTE tokens.
                                </p>
                                <div className="inline-block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                    <p className="text-gray-800 dark:text-gray-200 font-medium">Total Portfolio Value</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">${(user.balance * 1.25).toFixed(2)}</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 