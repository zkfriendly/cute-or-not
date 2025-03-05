'use client';

import { useState, useEffect } from 'react';
import { mockMemes } from '../../../data/mockData';
import { Meme } from '../../../types';
import Image from 'next/image';
import Link from 'next/link';

export default function RankingsPage() {
    // In a real app, we would fetch the rankings from a database
    // For this demo, we'll simulate rankings with random scores
    const [rankedMemes, setRankedMemes] = useState<Array<Meme & { score: number }>>([]);
    const [sortBy, setSortBy] = useState<'score' | 'votes' | 'date'>('score');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        // Simulate rankings with random scores between 800-1200
        const memes = mockMemes.map(meme => ({
            ...meme,
            score: Math.floor(Math.random() * 400) + 800
        }));

        sortMemes(memes, sortBy, sortOrder);
    }, [sortBy, sortOrder]);

    const sortMemes = (memes: Array<Meme & { score: number }>, by: string, order: 'asc' | 'desc') => {
        const sorted = [...memes].sort((a, b) => {
            let comparison = 0;

            if (by === 'score') {
                comparison = a.score - b.score;
            } else if (by === 'votes') {
                const totalVotesA = a.cuteVotes + a.notCuteVotes;
                const totalVotesB = b.cuteVotes + b.notCuteVotes;
                comparison = totalVotesA - totalVotesB;
            } else if (by === 'date') {
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            return order === 'desc' ? -comparison : comparison;
        });

        setRankedMemes(sorted);
        setSortBy(by as 'score' | 'votes' | 'date');
        setSortOrder(order);
    };

    const handleSort = (by: 'score' | 'votes' | 'date') => {
        const newOrder = sortBy === by && sortOrder === 'desc' ? 'asc' : 'desc';
        sortMemes(rankedMemes, by, newOrder);
    };

    const getSortIcon = (by: 'score' | 'votes' | 'date') => {
        if (sortBy !== by) return null;
        return sortOrder === 'desc' ? '↓' : '↑';
    };

    return (
        <div className="space-y-8 py-6">
            <section className="text-center py-8 px-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white">
                <h1 className="text-3xl font-bold mb-2">Meme Rankings</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    See how all memes rank based on user comparisons!
                </p>
            </section>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Memes Ranked</h2>
                    <Link
                        href="/compare"
                        className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
                    >
                        Back to Compare
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Meme
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('score')}
                                >
                                    Rating {getSortIcon('score')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('votes')}
                                >
                                    Total Votes {getSortIcon('votes')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort('date')}
                                >
                                    Created {getSortIcon('date')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {rankedMemes.map((meme, index) => (
                                <tr key={meme.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 relative flex-shrink-0">
                                                <Image
                                                    src={meme.imageUrl}
                                                    alt={meme.title}
                                                    fill
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <Link href={`/meme/${meme.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-pink-500 dark:hover:text-pink-400">
                                                    {meme.title}
                                                </Link>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    by {meme.creator}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                                            {meme.score}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {meme.cuteVotes + meme.notCuteVotes}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(meme.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center mt-8 space-x-4">
                <Link
                    href="/compare"
                    className="px-6 py-2 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-colors"
                >
                    Continue Comparing
                </Link>
                <Link
                    href="/"
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
} 