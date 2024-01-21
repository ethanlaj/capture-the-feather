import { Challenge } from '@/types/Challenge';
import axios from 'axios';
import { baseUrl } from '.';

export class ChallengeService {
	static async getChallenges(): Promise<Challenge[]> {
		const response = await axios.get(baseUrl + '/challenges');
		return response.data;
	}
}