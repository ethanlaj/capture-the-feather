import { Attempt } from "./Attempt";

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

export enum PointsType {
	Static = "static",
	Dynamic = "dynamic",
}

interface BaseChallenge {
	id: number;
	category: string;
	title: string;
	shortDescription: string;
	description: string;
	type: ChallengeType;
	points: number;
	maxAttempts: number;
	attempts: Attempt[];
	attemptsLeft: number;
	isSolved: boolean;
	isExhausted: boolean;
	isSolvedOrExhausted: boolean;
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