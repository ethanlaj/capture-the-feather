import { Challenge } from '@/types/Challenge';
import axios from 'axios';
import { baseUrl } from '.';

const url = baseUrl + '/challenges';
const adminUrl = url + '/admin';

export class ChallengeService {
	static async getChallenges(isAdmin: boolean): Promise<Challenge[]> {
		const response = await axios.get(isAdmin ? adminUrl : url);
		return response.data;
	}
}