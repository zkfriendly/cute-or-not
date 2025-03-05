'use client';

import { useState, useEffect } from 'react';
import { mockMemes } from '../../data/mockData';
import { Meme } from '../../types';
import Image from 'next/image';
import Link from 'next/link';

export default function ComparePage() {
    const [memes, setMemes] = useState<Meme[]>([]);
    const [currentPair, setCurrentPair] = useState<[Meme, Meme] | null>(null);
    const [rankings, setRankings] = useState<Record<string, number>>({});
    const [history, setHistory] = useState<Array<{ pair: [Meme, Meme], choice: string }>>([]);
    const [round, setRound] = useState(1);

    // Initialize memes and rankings
    useEffect(() => {
        // Clone the memes to avoid modifying the original data
        const shuffledMemes = [...mockMemes].sort(() => Math.random() - 0.5);
        setMemes(shuffledMemes);

        // Initialize rankings with default values
        const initialRankings: Record<string, number> = {};
        shuffledMemes.forEach(meme => {
            initialRankings[meme.id] = 1000; // Start with a base Elo rating of 1000
        });
        setRankings(initialRankings);

        // Set the first pair
        if (shuffledMemes.length >= 2) {
            setCurrentPair([shuffledMemes[0], shuffledMemes[1]]);
        }
    }, []);

    // Function to get a new random pair of memes
    const getNextPair = () => {
        if (memes.length < 2) return null;

        // Get two random memes that haven't been compared recently
        const recentPairs = new Set(
            history.slice(-Math.min(history.length, 5)).map(h => `${h.pair[0].id}-${h.pair[1].id}`)
        );

        let attempts = 0;
        let left: Meme, right: Meme;

        do {
            left = memes[Math.floor(Math.random() * memes.length)];
            right = memes[Math.floor(Math.random() * memes.length)];
            attempts++;

            // Prevent comparing the same meme or recently compared pairs
            if (attempts > 20) break; // Prevent infinite loop
        } while (
            left.id === right.id ||
            recentPairs.has(`${left.id}-${right.id}`) ||
            recentPairs.has(`${right.id}-${left.id}`)
        );

        return [left, right] as [Meme, Meme];
    };

    // Update Elo ratings based on the choice
    const updateRankings = (winnerId: string | null, loserId: string | null) => {
        if (!winnerId || !loserId) return;

        const K = 32; // K-factor determines how much ratings change
        const winnerRating = rankings[winnerId];
        const loserRating = rankings[loserId];

        // Calculate expected scores
        const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
        const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

        // Update ratings
        const newRankings = { ...rankings };
        newRankings[winnerId] = Math.round(winnerRating + K * (1 - expectedWinner));
        newRankings[loserId] = Math.round(loserRating + K * (0 - expectedLoser));

        setRankings(newRankings);
    };

    // Handle user choice
    const handleChoice = (choice: 'left' | 'right' | 'neither') => {
        if (!currentPair) return;

        const [left, right] = currentPair;

        // Update history
        setHistory([...history, { pair: currentPair, choice }]);

        // Update rankings based on choice
        if (choice === 'left') {
            updateRankings(left.id, right.id);
        } else if (choice === 'right') {
            updateRankings(right.id, left.id);
        }

        // Get next pair
        const nextPair = getNextPair();
        if (nextPair) {
            setCurrentPair(nextPair);
            setRound(round + 1);
        }
    };

    // Get sorted memes by ranking
    const getSortedMemes = () => {
        return [...memes].sort((a, b) => rankings[b.id] - rankings[a.id]);
    };

    if (!currentPair) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-xl text-gray-600 dark:text-gray-300">Loading memes...</p>
            </div>
        );
    }

    const [leftMeme, rightMeme] = currentPair;

    return (
        <div className="space-y-8 py-6">
            <section className="text-center py-8 px-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white">
                <h1 className="text-3xl font-bold mb-2">Meme Battle</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    Choose which meme you think is better, or select neither if you can't decide!
                </p>
                <div className="flex justify-center mt-4">
                    <Link
                        href="/compare/rankings"
                        className="inline-block px-6 py-2 bg-white/20 text-white font-medium rounded-full hover:bg-white/30 transition-colors"
                    >
                        View Full Rankings
                    </Link>
                </div>
                <p className="text-sm mt-2">Round: {round}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Meme */}
                <div className="flex flex-col items-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full max-w-md">
                        <div className="relative h-64 w-full">
                            <Image
                                src={leftMeme.imageUrl}
                                alt={leftMeme.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                {leftMeme.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {leftMeme.description}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleChoice('left')}
                        className="mt-4 px-6 py-2 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-colors"
                    >
                        Choose This One
                    </button>
                </div>

                {/* Right Meme */}
                <div className="flex flex-col items-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden w-full max-w-md">
                        <div className="relative h-64 w-full">
                            <Image
                                src={rightMeme.imageUrl}
                                alt={rightMeme.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                                {rightMeme.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {rightMeme.description}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleChoice('right')}
                        className="mt-4 px-6 py-2 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition-colors"
                    >
                        Choose This One
                    </button>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => handleChoice('neither')}
                    className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                    Neither / Can't Decide
                </button>
            </div>

            {/* Current Rankings */}
            <section className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Rankings</h2>
                    <Link
                        href="/compare/rankings"
                        className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
                    >
                        View All Rankings
                    </Link>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Meme</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {getSortedMemes().slice(0, 5).map((meme, index) => (
                                <tr key={meme.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 relative flex-shrink-0">
                                                <Image
                                                    src={meme.imageUrl}
                                                    alt={meme.title}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{meme.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{rankings[meme.id]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="flex justify-center mt-8">
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