import promptSync from 'prompt-sync';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'sequelize';
import dotenv from 'dotenv';
const mime = require('mime-types');
dotenv.config();

import { initDatabase } from '../server/src/database';
import { Challenge, ChallengeFile, ShortAnswerOption } from '../server/src/database/models';

(async () => {
	const prompt = promptSync();
	await initDatabase();

	// Function to recursively read directories and find challenge.yml files
	function findChallengeFiles(dir: string, files?: string[]): string[] {
		files = files || [];
		const filesInDirectory = fs.readdirSync(dir);

		for (const file of filesInDirectory) {
			const absolute = path.join(dir, file);
			if (fs.statSync(absolute).isDirectory()) {
				findChallengeFiles(absolute, files);
			} else if (file === 'challenge.yml') {
				files.push(absolute);
			}
		}

		return files;
	}

	async function processYaml(directory: string, filePath: string, index: number) {
		const content = fs.readFileSync(filePath, 'utf8');
		console.log(`Read file: ${filePath}`);
		const data = yaml.parse(content);

		const t = await Challenge.sequelize!.transaction();
		try {
			const challenge = Challenge.build({
				category: data.category,
				title: data.name,
				shortDescription: data.name,
				description: data.description,
				type: "short-answer",
				pointsType: data.type === 'dynamic' ? 'dynamic' : 'static',
				points: data.value,
				maxAttempts: 0,
				order: index,
			});

			if (challenge.pointsType === 'dynamic') {
				challenge.minPoints = data.minimum;
				challenge.decay = data.decay;
			}

			await challenge.save({ transaction: t });

			if (challenge.type === 'short-answer') {
				if (!data.flags || data.flags.length === 0) {
					throw new Error("Short answer challenges must have at least one flag")
				}

				for (let flag of data.flags) {
					await ShortAnswerOption.create({
						challengeId: challenge.id,
						value: flag,
						matchMode: 'static',
						isCaseSensitive: true,
					}, { transaction: t })
				}
			}

			if (data.files && data.files.length > 0) {
				for (let file of data.files) {
					await moveFileAndSaveToDatabase(path.join(directory, file), challenge.id, t);
				}
			}

			await t.commit();
		} catch (e) {
			console.error(e);
			await t.rollback();
		}
	}

	async function moveFileAndSaveToDatabase(fileName: string, challengeId: number, t: Transaction) {
		const originalname = path.basename(fileName);

		const newPath = `challengeFiles/${uuidv4()}-${originalname}`;

		await ChallengeFile.create({
			path: newPath,
			mimetype: mime.lookup(fileName) || 'application/octet-stream',
			filename: originalname,
			challengeId
		}, { transaction: t });

		fs.copyFileSync(fileName, path.join(__dirname, "..", "server", newPath));
	}

	const directory = prompt('Please enter the directory to look for files: ');
	const isDirectoryFound = fs.existsSync(directory);
	if (!isDirectoryFound) {
		console.log('Directory not found');
		process.exit(1);
	}

	const challengeFiles = findChallengeFiles(directory);

	for (let i = 0; i < challengeFiles.length; i++) {
		await processYaml(directory, challengeFiles[i], i);
	}

	process.exit(0);
})();