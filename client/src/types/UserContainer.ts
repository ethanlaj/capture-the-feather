import { Challenge } from "./Challenge";

export interface UserContainer {
	challengeId: number;
	userId: number;
	user?: {
		name: string;
	}
	ports: {
		nodePort: number;
		port: number;
		targetPort: number;
	}[];
	isDeleting: boolean;
	expiresAt: string;
}

export interface UserContainerWithK8Data extends UserContainer {
	isDeploymentReady: boolean;
	challenge: Challenge;
	user: {
		name: string;
		email: string;
	}
}