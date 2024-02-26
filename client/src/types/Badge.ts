export interface Badge {
	id: number;
	name: string;
	description: string;
	category?: string;
	basedOn: 'category' | 'all';
	condition: 'challenges' | 'points';
	threshold?: number;
	earners: string[];
	imageUrl: string;
	isAwarded: boolean;
}