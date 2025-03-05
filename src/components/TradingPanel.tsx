'use client';

import { useState } from 'react';
import { Meme } from '../types';
import { mockUser } from '../data/mockData';

interface TradingPanelProps {
    meme: Meme;
}

export default function TradingPanel({ meme }: TradingPanelProps) {
    const [activeTab, setActiveTab] = useState<'CUTE' | 'NOT_CUTE'>('CUTE');
    const [amount, setAmount] = useState<number>(1);
    const [user, setUser] = useState(mockUser);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const price = activeTab === 'CUTE' ? meme.cutePrice : meme.notCutePrice;
    const totalCost = price * amount;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setAmount(value);
        }
    };

    const handleBuy = () => {
        if (totalCost > user.balance) {
            setErrorMessage('Insufficient balance');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Mock transaction
        setUser({
            ...user,
            balance: user.balance - totalCost,
            trades: [
                ...user.trades,
                {
                    id: `t${Date.now()}`,
                    memeId: meme.id,
                    type: activeTab,
                    amount,
                    price,
                    timestamp: new Date().toISOString(),
                    userId: user.id,
                },
            ],
        });

        // Show success message
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Trade Tokens</h3>

            <div className="flex mb-6">
                <button
                    className={`flex-1 py-2 text-center rounded-l-lg transition-colors ${activeTab === 'CUTE'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    onClick={() => setActiveTab('CUTE')}
                >
                    CUTE
                </button>
                <button
                    className={`flex-1 py-2 text-center rounded-r-lg transition-colors ${activeTab === 'NOT_CUTE'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    onClick={() => setActiveTab('NOT_CUTE')}
                >
                    NOT CUTE
                </button>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Price
                </label>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${price.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activeTab === 'CUTE'
                        ? `${meme.cuteVotes} votes (${Math.round((meme.cuteVotes / (meme.cuteVotes + meme.notCuteVotes)) * 100)}%)`
                        : `${meme.notCuteVotes} votes (${Math.round((meme.notCuteVotes / (meme.cuteVotes + meme.notCuteVotes)) * 100)}%)`
                    }
                </p>
            </div>

            <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                </label>
                <div className="flex">
                    <button
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-l-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={() => amount > 1 && setAmount(amount - 1)}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-600 text-center"
                        min="1"
                    />
                    <button
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-r-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                        onClick={() => setAmount(amount + 1)}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Your Balance:</span>
                    <span className="font-medium text-gray-900 dark:text-white">${user.balance.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={handleBuy}
                className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${activeTab === 'CUTE'
                        ? 'bg-pink-500 hover:bg-pink-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                Buy {activeTab} Tokens
            </button>

            {isSuccess && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm">
                    Transaction successful! You purchased {amount} {activeTab} tokens.
                </div>
            )}

            {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
                    {errorMessage}
                </div>
            )}
        </div>
    );
} 