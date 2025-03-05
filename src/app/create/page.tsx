import CreateMemeForm from '../../components/CreateMemeForm';

export default function CreateMemePage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Create a New Meme</h1>
            <CreateMemeForm />
        </div>
    );
} 