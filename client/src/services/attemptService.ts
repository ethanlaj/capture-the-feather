import axios from 'axios';
import { baseUrl } from '.';
import { Challenge } from '@/types/Challenge';
import { Badge } from '@/types/Badge';

const url = baseUrl + '/attempts';

export interface SubmitAttemptResponse {
	challenge: Challenge;
	badges?: Badge[];
}

export class AttemptService {
	static async submitAttempt(challengeId: number, userAnswer: string): Promise<SubmitAttemptResponse> {
		const response = await axios.post<SubmitAttemptResponse>(url + `/${challengeId}`, { userAnswer });

		for (const badge of response.data.badges || []) {
			badge.imageUrl = baseUrl + badge.imageUrl;
		}

		return response.data;
	}
}