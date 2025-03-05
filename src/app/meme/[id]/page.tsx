'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { mockMemes } from '../../../data/mockData';
import { Meme } from '../../../types';
import TradingPanel from '../../../components/TradingPanel';
import RecentTrades from '../../../components/RecentTrades';

interface MemeDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function MemeDetailPage({ params }: MemeDetailPageProps) {
    const { id } = use(params);
    const [meme, setMeme] = useState<Meme | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock API call to fetch meme details
        const fetchMeme = () => {
            const foundMeme = mockMemes.find(m => m.id === id);

            if (foundMeme) {
                setMeme(foundMeme);
            }

            setLoading(false);
        };

        fetchMeme();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!meme) {
        notFound();
    }

    const totalVotes = meme.cuteVotes + meme.notCuteVotes;
    const cutePercentage = totalVotes > 0 ? Math.round((meme.cuteVotes / totalVotes) * 100) : 50;
    const notCutePercentage = 100 - cutePercentage;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        <div className="relative h-[300px] sm:h-[400px] w-full">
                            <Image
                                src={meme.imageUrl}
                                alt={meme.title}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{meme.title}</h1>

                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <span>By {meme.creator}</span>
                                <span className="mx-2">•</span>
                                <span>{formatDate(meme.createdAt)}</span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-6">{meme.description}</p>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cuteness Rating</h3>

                                <div className="flex h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="bg-pink-500 flex items-center justify-center text-xs text-white font-medium"
                                        style={{ width: `${cutePercentage}%` }}
                                    >
                                        {cutePercentage > 15 && `${cutePercentage}%`}
                                    </div>
                                    <div
                                        className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                                        style={{ width: `${notCutePercentage}%` }}
                                    >
                                        {notCutePercentage > 15 && `${notCutePercentage}%`}
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            CUTE: {meme.cuteVotes} votes
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            NOT CUTE: {meme.notCuteVotes} votes
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <RecentTrades memeId={meme.id} />
                </div>

                <div>
                    <TradingPanel meme={meme} />
                </div>
            </div>
        </div>
    );
} 