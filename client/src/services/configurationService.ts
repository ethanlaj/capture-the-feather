import { Configuration } from "@/types/Configuration";
import { baseUrl } from ".";
import axios from 'axios';

export class ConfigurationService {
	static async getConfiguration() {
		const response = await axios.get<Configuration>(baseUrl + '/configuration');
		return response.data;
	}

	static async updateConfiguration(configuration: Configuration) {
		const response = await axios.put<Configuration>(baseUrl + '/configuration', configuration);
		return response.data;
	}

	static async reorderCategories(categories: string[]) {
		await axios.post(baseUrl + '/configuration/reorder/categories', { categories });
	}

	static async reorderChallenges(category: string, challenges: number[]) {
		await axios.post(baseUrl + '/configuration/reorder/category/' + category, { challenges });
	}
}