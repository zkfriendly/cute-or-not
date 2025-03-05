'use client';

import { useState, useEffect } from 'react';
import { mockMemes } from '../../data/mockData';
import MemeCard from '../../components/MemeCard';
import { Meme } from '../../types';

export default function TrendingPage() {
    const [memes, setMemes] = useState<Meme[]>([]);
    const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'price'>('popular');

    useEffect(() => {
        let sortedMemes = [...mockMemes];

        if (sortBy === 'popular') {
            sortedMemes.sort((a, b) => (b.cuteVotes + b.notCuteVotes) - (a.cuteVotes + a.notCuteVotes));
        } else if (sortBy === 'recent') {
            sortedMemes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'price') {
            sortedMemes.sort((a, b) => Math.max(b.cutePrice, b.notCutePrice) - Math.max(a.cutePrice, a.notCutePrice));
        }

        setMemes(sortedMemes);
    }, [sortBy]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Trending Memes</h1>

                <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'popular'
                                ? 'bg-white dark:bg-gray-700 shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        onClick={() => setSortBy('popular')}
                    >
                        Popular
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'recent'
                                ? 'bg-white dark:bg-gray-700 shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        onClick={() => setSortBy('recent')}
                    >
                        Recent
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === 'price'
                                ? 'bg-white dark:bg-gray-700 shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        onClick={() => setSortBy('price')}
                    >
                        Price
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {memes.map(meme => (
                    <MemeCard key={meme.id} meme={meme} />
                ))}
            </div>
        </div>
    );
} 