'use client';

import { useState, useEffect } from 'react';
import { mockMemes } from '../data/mockData';
import { Meme } from '../types';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemeComparison() {
    const [memes, setMemes] = useState<Meme[]>([]);
    const [currentPair, setCurrentPair] = useState<[Meme, Meme] | null>(null);
    const [rankings, setRankings] = useState<Record<string, number>>({});
    const [history, setHistory] = useState<Array<{ pair: [Meme, Meme], choice: string }>>([]);
    const [round, setRound] = useState(1);
    const [showConfetti, setShowConfetti] = useState(false);
    const [lastChoice, setLastChoice] = useState<'left' | 'right' | 'neither' | null>(null);
    const [streak, setStreak] = useState(0);
    const [showEmoji, setShowEmoji] = useState<{ emoji: string, side: 'left' | 'right' | null }>({ emoji: '', side: null });

    // Gamification elements
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [xpToNextLevel, setXpToNextLevel] = useState(100);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [achievements, setAchievements] = useState<{ id: string, name: string, unlocked: boolean, icon: string }[]>([
        { id: 'first_vote', name: 'First Vote!', unlocked: false, icon: '🎮' },
        { id: 'streak_5', name: 'On Fire!', unlocked: false, icon: '🔥' },
        { id: 'streak_10', name: 'Unstoppable!', unlocked: false, icon: '⚡' },
        { id: 'vote_25', name: 'Opinion Leader', unlocked: false, icon: '🏅' },
        { id: 'vote_50', name: 'Meme Expert', unlocked: false, icon: '🧠' },
        { id: 'vote_100', name: 'Meme Legend', unlocked: false, icon: '👑' },
    ]);
    const [showAchievement, setShowAchievement] = useState<{ name: string, icon: string } | null>(null);
    const [comboMultiplier, setComboMultiplier] = useState(1);

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

    // Check and unlock achievements
    const checkAchievements = () => {
        const newAchievements = [...achievements];
        let achievementUnlocked = null;

        // First vote achievement
        if (history.length === 1 && !newAchievements[0].unlocked) {
            newAchievements[0].unlocked = true;
            achievementUnlocked = { name: newAchievements[0].name, icon: newAchievements[0].icon };
        }

        // Streak achievements
        if (streak === 5 && !newAchievements[1].unlocked) {
            newAchievements[1].unlocked = true;
            achievementUnlocked = { name: newAchievements[1].name, icon: newAchievements[1].icon };
        }

        if (streak === 10 && !newAchievements[2].unlocked) {
            newAchievements[2].unlocked = true;
            achievementUnlocked = { name: newAchievements[2].name, icon: newAchievements[2].icon };
        }

        // Vote count achievements
        if (history.length === 25 && !newAchievements[3].unlocked) {
            newAchievements[3].unlocked = true;
            achievementUnlocked = { name: newAchievements[3].name, icon: newAchievements[3].icon };
        }

        if (history.length === 50 && !newAchievements[4].unlocked) {
            newAchievements[4].unlocked = true;
            achievementUnlocked = { name: newAchievements[4].name, icon: newAchievements[4].icon };
        }

        if (history.length === 100 && !newAchievements[5].unlocked) {
            newAchievements[5].unlocked = true;
            achievementUnlocked = { name: newAchievements[5].name, icon: newAchievements[5].icon };
        }

        if (achievementUnlocked) {
            setShowAchievement(achievementUnlocked);
            setTimeout(() => setShowAchievement(null), 3000);
        }

        setAchievements(newAchievements);
    };

    // Update level based on XP
    const updateLevel = (newXp: number) => {
        const currentXp = xp + newXp;
        setXp(currentXp);

        if (currentXp >= xpToNextLevel) {
            const newLevel = level + 1;
            const xpRemaining = currentXp - xpToNextLevel;
            const newXpToNextLevel = Math.floor(xpToNextLevel * 1.5);

            setLevel(newLevel);
            setXp(xpRemaining);
            setXpToNextLevel(newXpToNextLevel);
            setShowLevelUp(true);

            // Show level up animation
            setTimeout(() => setShowLevelUp(false), 3000);

            // Add points bonus for leveling up
            setPoints(points + 100 * newLevel);
        }
    };

    // Handle user choice
    const handleChoice = (choice: 'left' | 'right' | 'neither') => {
        if (!currentPair) return;

        const [left, right] = currentPair;

        // Update history
        setHistory([...history, { pair: currentPair, choice }]);

        // Calculate point reward
        let pointReward = choice !== 'neither' ? 10 * comboMultiplier : 2;
        let xpReward = choice !== 'neither' ? 5 * comboMultiplier : 1;

        // Update rankings based on choice
        if (choice === 'left') {
            updateRankings(left.id, right.id);
            // Show reaction emoji
            setShowEmoji({ emoji: getRandomEmoji('positive'), side: 'left' });
        } else if (choice === 'right') {
            updateRankings(right.id, left.id);
            // Show reaction emoji
            setShowEmoji({ emoji: getRandomEmoji('positive'), side: 'right' });
        } else {
            // Show neutral reaction
            setShowEmoji({ emoji: getRandomEmoji('neutral'), side: null });
        }

        // Clear emoji after a delay
        setTimeout(() => setShowEmoji({ emoji: '', side: null }), 1000);

        // Update streak and combo multiplier
        if (choice === lastChoice && choice !== 'neither') {
            const newStreak = streak + 1;
            setStreak(newStreak);

            // Increase multiplier every 3 streak
            if (newStreak % 3 === 0) {
                const newMultiplier = Math.min(comboMultiplier + 0.5, 5); // Cap at 5x
                setComboMultiplier(newMultiplier);

                // Extra points for increasing multiplier
                pointReward += 15 * newMultiplier;
                xpReward += 10;
            }

            if (newStreak % 5 === 0) {
                // Show confetti every 5 streak
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);

                // Bonus points for 5 streak
                pointReward += 25 * comboMultiplier;
                xpReward += 15;
            }
        } else if (choice !== 'neither') {
            setStreak(1);
            setComboMultiplier(1);
        } else {
            // Reset streak on skip
            setStreak(0);
            setComboMultiplier(1);
        }

        setLastChoice(choice);

        // Add points and XP
        setPoints(points + Math.round(pointReward));
        updateLevel(xpReward);

        // Check for achievements
        checkAchievements();

        // Get next pair
        const nextPair = getNextPair();
        if (nextPair) {
            setCurrentPair(nextPair);
            setRound(round + 1);
        }
    };

    // Get random emoji based on sentiment
    const getRandomEmoji = (sentiment: 'positive' | 'neutral') => {
        const positiveEmojis = ['❤️', '😍', '🥰', '👍', '🔥', '⭐', '🌟', '💯', '🏆', '🎉'];
        const neutralEmojis = ['🤔', '😐', '🙄', '⏭️', '⏩', '🔄', '🆗', '👀'];

        const emojiSet = sentiment === 'positive' ? positiveEmojis : neutralEmojis;
        return emojiSet[Math.floor(Math.random() * emojiSet.length)];
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
        <div className="space-y-6">
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {/* This would be replaced with a proper confetti animation library in a real app */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl animate-bounce">🎉</div>
                    </div>
                </div>
            )}

            {showLevelUp && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 rounded-xl shadow-lg flex flex-col items-center"
                    >
                        <div className="text-5xl mb-2">🎯</div>
                        <div className="text-2xl font-bold text-white">LEVEL UP!</div>
                        <div className="text-3xl font-bold text-white">Level {level} 🌟</div>
                    </motion.div>
                </div>
            )}

            {showAchievement && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-xl shadow-lg flex flex-col items-center"
                    >
                        <div className="text-4xl mb-2">{showAchievement.icon}</div>
                        <div className="text-lg font-medium text-white">Achievement Unlocked!</div>
                        <div className="text-xl font-bold text-white">{showAchievement.name}</div>
                    </motion.div>
                </div>
            )}

            <div className="relative">
                {/* Game Status Bar */}
                <div className="bg-gray-800 rounded-xl p-3 mb-4 shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-blue-400">
                                {level}
                            </div>
                            <div>
                                <div className="text-xs text-gray-400">Level</div>
                                <div className="text-sm font-semibold text-white">{level}</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-400 text-sm">⭐</span>
                                <span className="text-white font-bold">{points.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-400">Points</div>
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-1">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(xp / xpToNextLevel) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>XP: {xp}/{xpToNextLevel}</span>
                        <span>{Math.floor((xp / xpToNextLevel) * 100)}%</span>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <div className="bg-pink-500/10 dark:bg-pink-900/30 px-3 py-1 rounded-full flex items-center">
                        <span className="text-pink-600 dark:text-pink-400 font-medium text-sm">Round {round}</span>
                    </div>

                    {streak > 1 && (
                        <div className="bg-yellow-500/10 dark:bg-yellow-900/30 px-3 py-1 rounded-full flex items-center animate-pulse">
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium text-sm">
                                🔥 {streak} streak! {comboMultiplier > 1 ? `(${comboMultiplier}x)` : ''}
                            </span>
                        </div>
                    )}

                    <div className="bg-blue-500/10 dark:bg-blue-900/30 px-3 py-1 rounded-full flex items-center">
                        <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">{history.length} votes</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-0.5 rounded-2xl">
                    <div className="bg-gray-900 rounded-2xl p-4">
                        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Which meme is cuter?
                        </h2>

                        <div className="sm:grid sm:grid-cols-2 sm:gap-8 flex flex-col relative">
                            {/* VS Badge - Desktop (absolute positioned) */}
                            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none hidden sm:block">
                                <motion.div
                                    key={`vs-desktop-${round}`}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-gray-900">
                                        VS
                                    </div>
                                </motion.div>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* Left Meme */}
                                <motion.div
                                    key={`left-${leftMeme.id}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative flex flex-col items-center"
                                >
                                    {showEmoji.side === 'left' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0, y: -20 }}
                                            className="absolute z-10 text-4xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                        >
                                            {showEmoji.emoji}
                                        </motion.div>
                                    )}

                                    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden w-full transform transition-all hover:scale-[1.02] hover:shadow-pink-500/20 hover:shadow-lg">
                                        <div className="relative aspect-square w-full">
                                            <Image
                                                src={leftMeme.imageUrl}
                                                alt={leftMeme.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-2 sm:p-3">
                                            <h3 className="text-base sm:text-lg font-semibold text-white">
                                                {leftMeme.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                                                {leftMeme.description}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChoice('left')}
                                        className="mt-2 sm:mt-3 px-4 sm:px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                                    >
                                        This One! 👈 {comboMultiplier > 1 && <span className="ml-1 text-xs">{comboMultiplier}x</span>}
                                    </motion.button>
                                </motion.div>
                            </AnimatePresence>

                            {/* VS Badge - Mobile (between cards) */}
                            <div className="flex justify-center my-4 sm:hidden">
                                <motion.div
                                    key={`vs-mobile-${round}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-gray-900">
                                        VS
                                    </div>
                                </motion.div>
                            </div>

                            <AnimatePresence mode="wait">
                                {/* Right Meme */}
                                <motion.div
                                    key={`right-${rightMeme.id}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative flex flex-col items-center"
                                >
                                    {showEmoji.side === 'right' && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0, y: -20 }}
                                            className="absolute z-10 text-4xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                        >
                                            {showEmoji.emoji}
                                        </motion.div>
                                    )}

                                    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden w-full transform transition-all hover:scale-[1.02] hover:shadow-purple-500/20 hover:shadow-lg">
                                        <div className="relative aspect-square w-full">
                                            <Image
                                                src={rightMeme.imageUrl}
                                                alt={rightMeme.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-2 sm:p-3">
                                            <h3 className="text-base sm:text-lg font-semibold text-white">
                                                {rightMeme.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                                                {rightMeme.description}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChoice('right')}
                                        className="mt-2 sm:mt-3 px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                                    >
                                        This One! 👉 {comboMultiplier > 1 && <span className="ml-1 text-xs">{comboMultiplier}x</span>}
                                    </motion.button>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-center mt-6">
                            {showEmoji.side === null && showEmoji.emoji && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0, y: -20 }}
                                    className="absolute z-10 text-4xl"
                                >
                                    {showEmoji.emoji}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleChoice('neither')}
                                className="px-4 py-2 bg-gray-700 text-gray-300 font-medium rounded-full hover:bg-gray-600 transition-colors text-sm"
                            >
                                Skip / Can&apos;t Decide 🤔
                            </motion.button>
                        </div>

                        {/* Achievements Section - Mobile Only */}
                        <div className="mt-6 pt-4 border-t border-gray-800 sm:hidden">
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Achievements</h3>
                            <div className="flex flex-wrap gap-2">
                                {achievements.filter(a => a.unlocked).slice(0, 3).map(achievement => (
                                    <div key={achievement.id} className="bg-gray-800 px-2 py-1 rounded-lg flex items-center gap-1">
                                        <span>{achievement.icon}</span>
                                        <span className="text-xs text-gray-300">{achievement.name}</span>
                                    </div>
                                ))}
                                {achievements.filter(a => a.unlocked).length === 0 && (
                                    <div className="text-xs text-gray-500 italic">No achievements yet. Keep voting!</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Rankings */}
            <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Current Rankings</h2>
                    <Link
                        href="/compare/rankings"
                        className="text-pink-400 hover:text-pink-300 font-medium text-sm"
                    >
                        View All Rankings
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Meme</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {getSortedMemes().slice(0, 5).map((meme, index) => (
                                <tr key={meme.id} className="hover:bg-gray-800/50">
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-white">
                                        {index === 0 && '🥇'}
                                        {index === 1 && '🥈'}
                                        {index === 2 && '🥉'}
                                        {index > 2 && `#${index + 1}`}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 relative flex-shrink-0">
                                                <Image
                                                    src={meme.imageUrl}
                                                    alt={meme.title}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-2">
                                                <Link href={`/meme/${meme.id}`} className="text-xs sm:text-sm font-medium text-white hover:text-pink-400">
                                                    {meme.title}
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-900/50 text-purple-300">
                                            {rankings[meme.id]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Achievements Section - Desktop */}
            <div className="hidden sm:block bg-gray-900 rounded-xl shadow-md overflow-hidden">
                <div className="p-3 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">Your Achievements</h2>
                </div>
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {achievements.map(achievement => (
                        <div
                            key={achievement.id}
                            className={`p-3 rounded-lg flex items-center gap-2 ${achievement.unlocked ? 'bg-gradient-to-r from-purple-800/30 to-blue-800/30 text-white' : 'bg-gray-800/50 text-gray-500'}`}
                        >
                            <div className={`text-2xl ${achievement.unlocked ? '' : 'opacity-50'}`}>{achievement.icon}</div>
                            <div>
                                <div className="font-medium">{achievement.name}</div>
                                <div className="text-xs">{achievement.unlocked ? 'Unlocked!' : 'Locked'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 