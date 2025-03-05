'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUser } from '../data/mockData';

export default function CreateMemeForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !imageUrl || !description) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        // Mock API call
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to home page
            router.push('/');
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Meme</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter a catchy title"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Image URL
                    </label>
                    <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Paste a direct link to your image (JPG, PNG, or GIF)
                    </p>
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Describe your meme..."
                    />
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 mr-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                        {isLoading ? 'Creating...' : 'Create Meme'}
                    </button>
                </div>
            </form>
        </div>
    );
} 