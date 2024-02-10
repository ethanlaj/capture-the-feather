import { Challenge } from '@/types/Challenge';
import axios from 'axios';
import { baseUrl } from '.';

const url = baseUrl + '/challenges';

export class ChallengeService {
	static async getChallenges(): Promise<Challenge[]> {
		const response = await axios.get(url);
		return response.data;
	}
}