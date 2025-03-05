'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Meme } from '../types';

interface MemeCardProps {
    meme: Meme;
}

export default function MemeCard({ meme }: MemeCardProps) {
    const totalVotes = meme.cuteVotes + meme.notCuteVotes;
    const cutePercentage = totalVotes > 0 ? Math.round((meme.cuteVotes / totalVotes) * 100) : 50;
    const notCutePercentage = 100 - cutePercentage;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
            <Link href={`/meme/${meme.id}`}>
                <div className="relative h-48 sm:h-64 w-full">
                    <Image
                        src={meme.imageUrl}
                        alt={meme.title}
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            <div className="p-4">
                <Link href={`/meme/${meme.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 hover:text-pink-500 dark:hover:text-pink-400">
                        {meme.title}
                    </h3>
                </Link>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {meme.description}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>By {meme.creator}</span>
                    <span>{formatDate(meme.createdAt)}</span>
                </div>

                <div className="flex h-2 mb-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="bg-pink-500"
                        style={{ width: `${cutePercentage}%` }}
                    />
                    <div
                        className="bg-blue-500"
                        style={{ width: `${notCutePercentage}%` }}
                    />
                </div>

                <div className="flex justify-between text-xs mb-4">
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-pink-500 mr-1"></span>
                        <span className="text-gray-700 dark:text-gray-300">CUTE {cutePercentage}%</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                        <span className="text-gray-700 dark:text-gray-300">NOT CUTE {notCutePercentage}%</span>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="text-center px-3 py-1 bg-pink-100 dark:bg-pink-900 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-300">CUTE</p>
                        <p className="font-semibold text-pink-600 dark:text-pink-400">${meme.cutePrice.toFixed(2)}</p>
                    </div>
                    <div className="text-center px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-300">NOT CUTE</p>
                        <p className="font-semibold text-blue-600 dark:text-blue-400">${meme.notCutePrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 