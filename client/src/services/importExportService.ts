import { baseUrl } from ".";
import axios from 'axios';

export class ImportExportService {
	static async export(): Promise<Blob> {
		const response = await axios.post(baseUrl + '/importExport/export', {}, {
			responseType: 'blob',
		});
		return response.data;
	}

	static async import(file: File) {
		const formData = new FormData();
		formData.append('file', file);

		await axios.post(baseUrl + '/importExport/import', formData);
	}
}