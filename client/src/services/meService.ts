import { User } from "@/types/User";
import { baseUrl } from ".";
import axios from 'axios';

interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

interface LoginRegisterResponse extends TokenResponse {
	user: User;
}

export class MeService {
	static async getNewTokens(): Promise<TokenResponse> {
		const refreshToken = await MeService.getRefreshToken();
		const response = await axios.post(baseUrl + '/me/refresh', { token: refreshToken });
		return response.data;
	}

	static async login(data: { email: string, password: string }): Promise<LoginRegisterResponse> {
		const response = await axios.post(baseUrl + '/me/login', data);
		return response.data;
	}

	static async register(data: { email: string, name: string, password: string }): Promise<LoginRegisterResponse> {
		const response = await axios.post(baseUrl + '/me/register', data);
		return response.data;
	}

	static async logout() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
	}

	static async getAccessToken() {
		return localStorage.getItem('accessToken');
	}

	static async getRefreshToken() {
		return localStorage.getItem('refreshToken');
	}

	static async setAccessToken(accessToken: string) {
		localStorage.setItem('accessToken', accessToken);
	}

	static async setRefreshToken(refreshToken: string) {
		localStorage.setItem('refreshToken', refreshToken);
	}
}