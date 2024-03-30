import { Challenge } from '@/types/Challenge';
import axios from 'axios';
import { baseUrl } from '.';
import { UserContainer, UserContainerWithK8Data } from '@/types/UserContainer';

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

	static async updateChallenge(id: number, data: FormData): Promise<void> {
		return await axios.put(`${adminUrl}/${id}`, data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	static async deleteChallenge(id: number): Promise<void> {
		return await axios.delete(`${adminUrl}/${id}`);
	}

	static async downloadChallengeFile(fileId: number) {
		return await axios.get(`${url}/file/${fileId}`, {
			responseType: 'blob',
		});
	}

	// Admin route
	static async getChallengeContainers() {
		const response = await axios.get<UserContainerWithK8Data[]>(`${url}/containers`);
		return response.data;
	}

	static async getChallengeContainer(id: number) {
		const response = await axios.get<UserContainer | null>(`${url}/${id}/container`);
		return response.data;
	}

	static async startChallengeContainer(id: number) {
		const response = await axios.post<UserContainer>(`${url}/${id}/container`);
		return response.data;
	}

	static async stopChallengeContainer(id: number) {
		return await axios.delete(`${url}/${id}/container`);
	}

	static formatContainerAccessInstructions(instructions: string, container: UserContainer) {
		const address = "http://localhost"

		for (const port of container.ports) {
			const addrPortRegex = new RegExp(`\\{addr:port:${port.port}\\}`, 'g');
			instructions = instructions.replace(addrPortRegex, `${address}:${port.nodePort}`);

			const portRegex = new RegExp(`\\{port:${port.port}\\}`, 'g');
			instructions = instructions.replace(portRegex, `${port.nodePort}`);
		}

		return instructions;
	}
}