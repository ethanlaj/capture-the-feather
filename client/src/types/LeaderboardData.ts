export interface LeaderboardData {
	chartData: {
		key: number;
		name: string;
		timestamp: number;
		cumulativePoints: number;
	}[];
	tableData: {
		id: number;
		name: string;
		totalPoints: number;
	}[];
}