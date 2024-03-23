import axios from 'axios';
import { baseUrl } from '.';
import { Challenge } from '@/types/Challenge';
import { Badge } from '@/types/Badge';
import { AttemptAdmin } from '@/types/Attempt';

const url = baseUrl + '/attempts';
const adminUrl = url + '/admin';

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

	static async getAttempts() {
		const response = await axios.get<AttemptAdmin[]>(adminUrl);
		return response.data;
	}
}