export type Challenge = MultipleChoiceChallenge | ShortAnswerChallenge;

export interface MultipleChoiceChallenge extends BaseChallenge {
	multipleChoiceOptions: MultipleChoiceOption[];
}

export interface ShortAnswerChallenge extends BaseChallenge {
	shortAnswerOptions?: ShortAnswerOption[];
}

export enum ChallengeType {
	MultipleChoice = "multiple-choice",
	ShortAnswer = "short-answer",
}

interface BaseChallenge {
	id: number;
	title: string;
	description: string;
	type: ChallengeType;
}

export interface MultipleChoiceOption {
	id: number;
	value: string;
	isCorrect?: boolean;
}

export interface ShortAnswerOption {
	id: number;
	value: string;
	isCorrect?: boolean;
	isCaseSensitive: boolean;
	matchMode?: ShortAnswerMatchMode;
	regExp?: string;
}

export enum ShortAnswerMatchMode {
	Exact = "exact",
	Regex = "regex",
}