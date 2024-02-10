import axios from 'axios';
import { baseUrl } from '.';
import { Challenge } from '@/types/Challenge';

const url = baseUrl + '/attempts';

export class AttemptService {
	static async submitAttempt(challengeId: number, userAnswer: string): Promise<Challenge> {
		const response = await axios.post(url + `/${challengeId}`, { userAnswer });
		return response.data;
	}
}