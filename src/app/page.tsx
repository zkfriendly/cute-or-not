import { mockMemes } from '../data/mockData';
import MemeCard from '../components/MemeCard';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 px-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Cute or Not</h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          The first memecoin platform where you can trade on the cuteness of anything!
        </p>
        <Link
          href="/create"
          className="inline-block px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
        >
          Create Your Meme
        </Link>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Memes</h2>
          <Link
            href="/trending"
            className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
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

      <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Create or Find</h3>
            <p className="text-gray-600 dark:text-gray-300">Upload your own cute meme or browse existing ones</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Vote & Trade</h3>
            <p className="text-gray-600 dark:text-gray-300">Decide if it&apos;s CUTE or NOT CUTE and buy tokens</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Profit!</h3>
            <p className="text-gray-600 dark:text-gray-300">Earn rewards as your prediction becomes popular</p>
          </div>
        </div>
      </section>
    </div>
  );
}
