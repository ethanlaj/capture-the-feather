import fs from 'fs';
import path from 'path';
import { Model, ModelCtor } from 'sequelize-typescript';

export class ImportExportService {
	static async exportTableToJSON(model: ModelCtor<Model<any, any>>, filename: string) {
		const filePath = path.join(__dirname, "../../temp", filename);

		const data = await model.unscoped().findAll();
		const jsonData = JSON.stringify(data.map(record => record.toJSON()), null, 2);
		await fs.promises.writeFile(filePath, jsonData, 'utf8');

		return filePath;
	}
}
