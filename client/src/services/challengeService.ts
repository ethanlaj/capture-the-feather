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

	static async getChallenge(id: number): Promise<Challenge> {
		const response = await axios.get(`${adminUrl}/${id}`);
		return response.data;
	}

	static async createChallenge(data: FormData): Promise<void> {
		return await axios.post(adminUrl, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async updateChallenge(id: number, challenge: any): Promise<void> {
		return await axios.put(`${adminUrl}/${id}`, challenge);
	}

	static async deleteChallenge(id: number): Promise<void> {
		return await axios.delete(`${adminUrl}/${id}`);
	}
}