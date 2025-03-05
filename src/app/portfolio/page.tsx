'use client';

import { useState, useEffect } from 'react';
import { mockUser, mockTrades, mockMemes } from '../../data/mockData';
import Link from 'next/link';
import Image from 'next/image';

interface PortfolioItem {
    memeId: string;
    memeTitle: string;
    memeImage: string;
    cuteAmount: number;
    notCuteAmount: number;
    cuteValue: number;
    notCuteValue: number;
    totalValue: number;
}

export default function PortfolioPage() {
    const [user] = useState(mockUser);
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        // Calculate portfolio from trades
        const userTrades = mockTrades.filter(trade => trade.userId === user.id);
        const portfolioMap = new Map<string, PortfolioItem>();

        userTrades.forEach(trade => {
            const meme = mockMemes.find(m => m.id === trade.memeId);
            if (!meme) return;

            if (!portfolioMap.has(trade.memeId)) {
                portfolioMap.set(trade.memeId, {
                    memeId: trade.memeId,
                    memeTitle: meme.title,
                    memeImage: meme.imageUrl,
                    cuteAmount: 0,
                    notCuteAmount: 0,
                    cuteValue: 0,
                    notCuteValue: 0,
                    totalValue: 0
                });
            }

            const item = portfolioMap.get(trade.memeId)!;

            if (trade.type === 'CUTE') {
                item.cuteAmount += trade.amount;
                item.cuteValue = item.cuteAmount * meme.cutePrice;
            } else {
                item.notCuteAmount += trade.amount;
                item.notCuteValue = item.notCuteAmount * meme.notCutePrice;
            }

            item.totalValue = item.cuteValue + item.notCuteValue;
            portfolioMap.set(trade.memeId, item);
        });

        const portfolioItems = Array.from(portfolioMap.values());
        setPortfolio(portfolioItems);

        const total = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
        setTotalValue(total);
    }, [user.id]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Your Portfolio</h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm px-6 py-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Value</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">${(totalValue + user.balance).toFixed(2)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Available Balance</h2>
                    </div>
                    <div className="p-6">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">${user.balance.toFixed(2)}</div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Investments</h2>
                    </div>

                    {portfolio.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">You don&apos;t have any investments yet.</p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700"
                            >
                                Explore Memes
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                        <th className="px-6 py-3 text-left">Meme</th>
                                        <th className="px-6 py-3 text-right">CUTE Tokens</th>
                                        <th className="px-6 py-3 text-right">NOT CUTE Tokens</th>
                                        <th className="px-6 py-3 text-right">Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.map(item => (
                                        <tr key={item.memeId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4">
                                                <Link href={`/meme/${item.memeId}`} className="flex items-center">
                                                    <div className="relative w-10 h-10 rounded-md overflow-hidden mr-3">
                                                        <Image
                                                            src={item.memeImage}
                                                            alt={item.memeTitle}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.memeTitle}</span>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.cuteAmount > 0 ? (
                                                    <div>
                                                        <div className="text-gray-800 dark:text-gray-200">{item.cuteAmount}</div>
                                                        <div className="text-xs text-pink-600 dark:text-pink-400">${item.cuteValue.toFixed(2)}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {item.notCuteAmount > 0 ? (
                                                    <div>
                                                        <div className="text-gray-800 dark:text-gray-200">{item.notCuteAmount}</div>
                                                        <div className="text-xs text-blue-600 dark:text-blue-400">${item.notCuteValue.toFixed(2)}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-green-600 dark:text-green-400">
                                                ${item.totalValue.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 