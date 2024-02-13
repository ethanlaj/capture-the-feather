import axios from 'axios';
import { baseUrl } from '.';
import { LeaderboardData } from '@/types/LeaderboardData';

const url = baseUrl + '/leaderboard';

export class LeaderboardService {
	static async getLeaderboardData(): Promise<LeaderboardData> {
		const response = await axios.get(url);
		return response.data;
	}
}