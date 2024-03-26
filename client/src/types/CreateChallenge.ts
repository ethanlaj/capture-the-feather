import { ChallengeType, PointsType } from "./Challenge";
import { ChallengeFile } from "./ChallengeFile";

export interface CreateChallengeForm {
	title: string;
	category: string;
	shortDescription: string;
	description: string;
	pointsType: PointsType;
	points: number;
	maxAttempts: number;
	minPoints: number;
	decay: number;
	isContainer: boolean;
	containerImage: string;
	containerPorts: {
		key: number;
		name: number;
		port: number;
	}[];
	containerInstructions: string;
	challengeType: ChallengeType;
	multipleChoiceOptions: {
		key: number;
		name: number;
		option: string;
		isCorrect: boolean;
	}[];
	shortAnswerOptions: {
		key: number;
		name: number;
		option: string;
		isCorrect: boolean;
		isCaseSensitive: boolean;
		isRegularExpression: boolean;
		regExp: string;
	}[];
	newFiles: {
		name: string;
		originFileObj: File;
	}[];
	existingFiles: ChallengeFile[];
	filesToDelete: number[];
}