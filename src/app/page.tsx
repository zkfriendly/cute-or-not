'use client';

import { mockMemes } from '../data/mockData';
import MemeCard from '../components/MemeCard';
import MemeComparison from '../components/MemeComparison';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-8 px-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Cute or Not</h1>
        <p className="text-xl max-w-2xl mx-auto">
          The first memecoin platform where you can trade on the cuteness of anything!
        </p>
      </section>

      {/* Meme Comparison Feature */}
      <section>
        <MemeComparison />
      </section>

      {/* Trending Memes Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Trending Memes</h2>
          <Link
            href="/trending"
            className="text-pink-400 hover:text-pink-300 font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMemes.map(meme => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      </section>

      <section className="bg-gray-800 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-700 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-pink-900/30 rounded-full flex items-center justify-center text-pink-400 text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Compare Memes</h3>
            <p className="text-gray-300">Vote for your favorite memes in head-to-head battles</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-pink-900/30 rounded-full flex items-center justify-center text-pink-400 text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Create & Share</h3>
            <p className="text-gray-300">Upload your own memes and share them with the community</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-pink-900/30 rounded-full flex items-center justify-center text-pink-400 text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Trade & Earn</h3>
            <p className="text-gray-300">Buy and sell tokens based on meme popularity</p>
          </div>
        </div>
      </section>

      <div className="flex justify-center">
        <Link
          href="/create"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
        >
          Create Your Own Meme
        </Link>
      </div>
    </div>
  );
}
