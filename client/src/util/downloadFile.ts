import { ChallengeService } from "@/services/challengeService";

export async function downloadFile(fileId: number, fileName: string) {
	try {
		const response = await ChallengeService.downloadChallengeFile(fileId);
		const url = window.URL.createObjectURL(response.data);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error('Download failed', error);
	}
}
