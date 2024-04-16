import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

export class KubernetesService {
	static challengeIdToNamespace(challengeId: number) {
		return `challenge-${challengeId}`;
	}

	static async createDeployment(challengeId: number, userId: number, containerImage: string, ports: number[]) {
		const namespaceName = this.challengeIdToNamespace(challengeId);
		const getNamespaceResult = await this.getNamespace(namespaceName);
		if (!getNamespaceResult.exists) {
			await this.createNamespace(namespaceName);
		}

		await this.createDeploymentInNamespace(challengeId, userId, namespaceName, containerImage, ports);
		const serviceRes = await KubernetesService.createServiceForDeployment(challengeId, userId, namespaceName, ports);

		await this.waitForActiveDeployment(challengeId, userId);

		return serviceRes.spec?.ports;
	}

	private static async waitForActiveDeployment(challengeId: number, userId: number) {
		return new Promise(async (resolve, reject) => {
			let isActive = false;
			let tries = 0;
			do {
				try {
					const deployments = await KubernetesService.getDeploymentsByChallengeAndUser(challengeId, userId);
					const deployment = deployments[0];

					console.log("Deployment status:", deployment?.status?.readyReplicas)

					isActive = deployment?.status?.readyReplicas === 1;
				} catch (error) {
					console.error("Error checking deployment status:", error);
				}
				if (!isActive) {
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
				tries++;
			} while (!isActive && tries < 60 * 5);

			if (!isActive) {
				reject("Deployment could not be completed.");
			} else {
				resolve(null);
			}
		});
	}

	private static async waitForDeploymentDeletion(challengeId: number, userId: number) {
		return new Promise(async (resolve, reject) => {
			let isDeleted = false;
			let tries = 0;
			do {
				try {
					const deployments = await KubernetesService.getDeploymentsByChallengeAndUser(challengeId, userId);
					isDeleted = deployments.length === 0;
				} catch (error) {
					console.error("Error checking deployment status:", error);
				}
				if (!isDeleted) {
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
				tries++;
			} while (!isDeleted && tries < 60 * 5);

			if (!isDeleted) {
				reject("Deployment could not be deleted.");
			} else {
				resolve(null);
			}
		});
	}

	static async deleteDeployment(challengeId: number, userId: number) {
		const namespaceName = `challenge-${challengeId}`;

		await k8sAppsApi.deleteNamespacedDeployment(`deployment-${challengeId}-${userId}`, namespaceName).catch(error => {
			console.error("Error deleting deployment:", error);
		});
		await k8sApi.deleteNamespacedService(`service-${challengeId}-${userId}`, namespaceName).catch(error => {
			console.error("Error deleting service:", error);
		});

		await this.waitForDeploymentDeletion(challengeId, userId);
	}

	private static async getNamespace(namespace: string) {
		try {
			const getNamespaceRes = await k8sApi.readNamespace(namespace);
			return {
				exists: getNamespaceRes.body.metadata?.name === namespace,
				namespace: getNamespaceRes.body
			};
		} catch (error) {
			return {
				exists: false,
				namespace: null
			};
		}
	}

	private static async createNamespace(namespaceName: string) {
		const namespace: k8s.V1Namespace = {
			apiVersion: 'v1',
			kind: 'Namespace',
			metadata: {
				name: namespaceName,
			},
		};

		return (await k8sApi.createNamespace(namespace)).body
	}

	private static async createDeploymentInNamespace(
		challengeId: number,
		userId: number,
		namespace: string,
		containerImage: string,
		ports: number[],
		retry = false
	): Promise<k8s.V1Deployment> {
		const appName = `app-${challengeId}-${userId}`;
		const containerPorts = ports.map(port => ({ containerPort: port, name: `port-${port}` }));

		const deployment: k8s.V1Deployment = {
			apiVersion: 'apps/v1',
			kind: 'Deployment',
			metadata: {
				name: `deployment-${challengeId}-${userId}`,
				namespace: namespace,
				labels: {
					challengeId: challengeId.toString(),
					userId: userId.toString(),
				},
			},
			spec: {
				replicas: 1,
				selector: {
					matchLabels: {
						app: appName,
					},
				},
				template: {
					metadata: {
						labels: {
							app: appName,
						},
					},
					spec: {
						containers: [{
							name: `container-${challengeId}`,
							image: containerImage,
							ports: containerPorts,
						}],
					},
				},
			},
		};

		try {
			return (await k8sAppsApi.createNamespacedDeployment(namespace, deployment)).body;
		} catch (error: any) {
			if (error.statusCode === 409 && !retry) {
				// Delete existing deployment and try again
				await this.deleteDeployment(challengeId, userId);
				return this.createDeploymentInNamespace(challengeId, userId, namespace, containerImage, ports, true);
			}

			throw error;
		}
	}

	static async createServiceForDeployment(challengeId: number, userId: number, namespace: string, ports: number[], retry = false) {
		const servicePorts = ports.map(port => ({
			name: `port-${port}`,
			protocol: 'TCP',
			port: port, // The external port, accessible from outside the cluster
			targetPort: port, // The target port on the container
		}));

		const service = {
			apiVersion: 'v1',
			kind: 'Service',
			metadata: {
				name: `service-${challengeId}-${userId}`,
				namespace: namespace,
				labels: {
					challengeId: challengeId.toString(),
					userId: userId.toString(),
				},
			},
			spec: {
				type: 'NodePort',
				selector: {
					app: `app-${challengeId}-${userId}`,
				},
				ports: servicePorts,
			},
		};

		return (await k8sApi.createNamespacedService(namespace, service)).body;
	}

	static async getDeploymentsByChallengeAndUser(challengeId: number, userId: number) {
		const namespace = this.challengeIdToNamespace(challengeId);
		const labelSelector = `challengeId=${challengeId},userId=${userId}`;

		try {
			const deployments = await k8sAppsApi.listNamespacedDeployment(namespace, undefined, undefined, undefined, undefined, labelSelector);
			return deployments.body.items;
		} catch (error) {
			console.error("Error fetching deployments:", error);
			throw error;
		}
	}

	static async getServicesByChallengeAndUser(challengeId: number, userId: number) {
		const namespace = this.challengeIdToNamespace(challengeId);
		const labelSelector = `challengeId=${challengeId},userId=${userId}`;

		try {
			const services = await k8sApi.listNamespacedService(namespace, undefined, undefined, undefined, undefined, labelSelector);
			return services.body.items;
		} catch (error) {
			console.error("Error fetching services:", error);
			throw error;
		}
	}

	public static async getAllDeployments() {
		try {
			const deployments = await k8sAppsApi.listDeploymentForAllNamespaces();
			return deployments.body.items;
		} catch (error) {
			console.error("Error fetching deployments:", error);
			throw error;
		}
	}
}