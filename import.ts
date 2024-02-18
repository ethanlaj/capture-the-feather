import promptSync from 'prompt-sync';
import fs from 'fs';
import path from 'path';
const prompt = promptSync();

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

function processYaml(filePath: string) {
	const content = fs.readFileSync(filePath, 'utf8');
	console.log(`Read file: ${filePath}`);
	console.log(content)
}

const directory = prompt('Please enter the directory to look for files: ');
const isDirectoryFound = fs.existsSync(directory);
if (!isDirectoryFound) {
	console.log('Directory not found');
	process.exit(1);
}

const challengeFiles = findChallengeFiles(directory);

challengeFiles.forEach(processYaml);