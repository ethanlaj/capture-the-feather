export interface Attempt {
	id: string;
	userId: string;
	challengeId: string;
	userAnswer: string;
	isCorrect: boolean;
	mutlipleChoiceOptionId: string;
}