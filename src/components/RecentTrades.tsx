'use client';

import { Trade } from '../types';
import { mockTrades } from '../data/mockData';
import { useState, useEffect } from 'react';

interface RecentTradesProps {
    memeId: string;
}

export default function RecentTrades({ memeId }: RecentTradesProps) {
    const [trades, setTrades] = useState<Trade[]>([]);

    useEffect(() => {
        // Filter trades for this meme
        const filteredTrades = mockTrades
            .filter(trade => trade.memeId === memeId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setTrades(filteredTrades);
    }, [memeId]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (trades.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Trades</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center py-6">No trades yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Trades</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="pb-2 text-left">Type</th>
                            <th className="pb-2 text-right">Amount</th>
                            <th className="pb-2 text-right">Price</th>
                            <th className="pb-2 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trades.map(trade => (
                            <tr key={trade.id} className="border-b border-gray-100 dark:border-gray-800">
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
                                <td className="py-3 text-right">
                                    <div className="text-gray-800 dark:text-gray-200">{formatTime(trade.timestamp)}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(trade.timestamp)}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 