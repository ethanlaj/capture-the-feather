import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

export class KubernetesService {
	static async createDeployment(challengeId: number, userId: number, containerImage: string, ports: number[]) {
		try {
			const namespaceName = `challenge-${challengeId}`;
			const getNamespaceResult = await this.getNamespace(namespaceName);
			if (!getNamespaceResult.exists) {
				await this.createNamespace(namespaceName);
			}

			await this.createDeploymentInNamespace(challengeId, userId, namespaceName, containerImage, ports);
			const serviceRes = await KubernetesService.createServiceForDeployment(challengeId, userId, namespaceName, ports);
			return serviceRes.spec?.ports;
		} catch (error) {
			console.error(error);
		}
	}

	static async deleteDeployment(challengeId: number, userId: number) {
		const namespaceName = `challenge-${challengeId}`;

		try {
			await k8sAppsApi.deleteNamespacedDeployment(`deployment-${challengeId}-${userId}`, namespaceName);
		} catch (error) {
			console.error(`Error deleting deployment for challengeId ${challengeId} and userId ${userId}:`, error);
		}

		try {
			await k8sApi.deleteNamespacedService(`service-${challengeId}-${userId}`, namespaceName);
		} catch (error) {
			console.error(`Error deleting service for challengeId ${challengeId} and userId ${userId}:`, error);
		}
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

	private static async createDeploymentInNamespace(challengeId: number, userId: number, namespace: string, containerImage: string, ports: number[]) {
		const appName = `app-${challengeId}-${userId}`;
		const containerPorts = ports.map(port => ({ containerPort: port }));

		const deployment = {
			apiVersion: 'apps/v1',
			kind: 'Deployment',
			metadata: {
				name: `deployment-${challengeId}-${userId}`,
				namespace: namespace,
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

		return (await k8sAppsApi.createNamespacedDeployment(namespace, deployment)).body;
	}

	static async createServiceForDeployment(challengeId: number, userId: number, namespace: string, ports: number[]) {
		const servicePorts = ports.map(port => ({
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
}