export interface Attempt {
	id: number;
	userId: string;
	challengeId: string;
	userAnswer: string;
	isCorrect: boolean;
	multipleChoiceOptionId: string;
}