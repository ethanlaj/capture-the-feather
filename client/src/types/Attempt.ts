import { Challenge } from "./Challenge";

export interface Attempt {
	id: number;
	userId: string;
	challengeId: string;
	userAnswer: string;
	isCorrect: boolean;
	multipleChoiceOptionId: number;
}

export interface AttemptAdmin extends Attempt {
	challenge: Challenge;
	user: {
		name: string;
	}
	createdAt: string;
}