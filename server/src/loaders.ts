import { Sequelize } from 'sequelize-typescript';
import * as models from './database/models';

export async function load() {
	try {
		const sequelize = new Sequelize(process.env.CTF_DB_URL!, {
			dialect: 'mysql',
			models: Object.values(models),
			logging: false,
		});

		await sequelize.sync();
		console.log('Database synced successfully.');
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}