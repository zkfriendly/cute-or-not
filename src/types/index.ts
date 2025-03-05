export interface Meme {
    id: string;
    title: string;
    imageUrl: string;
    description: string;
    createdAt: string;
    creator: string;
    cuteVotes: number;
    notCuteVotes: number;
    cutePrice: number;
    notCutePrice: number;
}

export interface Trade {
    id: string;
    memeId: string;
    type: 'CUTE' | 'NOT_CUTE';
    amount: number;
    price: number;
    timestamp: string;
    userId: string;
}

export interface User {
    id: string;
    username: string;
    balance: number;
    trades: Trade[];
} 