import axios from 'axios';
import { baseUrl } from '.';
import { Badge } from '@/types/Badge';

const url = baseUrl + '/badges';

export class BadgeService {
	static async getBadges() {
		const response = await axios.get<Badge[]>(url);

		for (const badge of response.data) {
			badge.imageUrl = baseUrl + badge.imageUrl;
		}

		return response.data;
	}
}