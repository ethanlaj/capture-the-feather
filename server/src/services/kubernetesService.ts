import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

export class KubernetesService {
	static async createDeployment(challengeId: string, containerImage: string) {
		try {
			let getNamespaceResult = await this.getNamespace(challengeId);
			const namespace = getNamespaceResult.exists ? getNamespaceResult.namespace : await this.createNamespace(challengeId);
			const namespaceName = namespace!.metadata!.name!;

			await this.createDeploymentInNamespace(challengeId, namespaceName, containerImage);
			const serviceRes = await KubernetesService.createServiceForDeployment(challengeId, namespaceName);
			return serviceRes;
		} catch (error) {
			console.error(error);
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

	private static async createDeploymentInNamespace(challengeId: string, namespace: string, containerImage: string) {
		const deployment = {
			apiVersion: 'apps/v1',
			kind: 'Deployment',
			metadata: {
				name: `deployment-${challengeId}`,
				namespace: namespace,
			},
			spec: {
				replicas: 1,
				selector: {
					matchLabels: {
						app: `app-${challengeId}`,
					},
				},
				template: {
					metadata: {
						labels: {
							app: `app-${challengeId}`,
						},
					},
					spec: {
						containers: [{
							name: `container-${challengeId}`,
							image: containerImage,
							ports: [{ containerPort: 80 }],
						}],
					},
				},
			},
		};

		return (await k8sAppsApi.createNamespacedDeployment(namespace, deployment)).body;
	}

	static async createServiceForDeployment(challengeId: string, namespace: string) {
		const service = {
			apiVersion: 'v1',
			kind: 'Service',
			metadata: {
				name: `service-${challengeId}`,
				namespace: namespace,
			},
			spec: {
				type: 'NodePort',
				selector: {
					app: `app-${challengeId}`,
				},
				ports: [{
					protocol: 'TCP',
					port: 80, // The port your container is listening on
					targetPort: 3333, // The target port on the container
				}],
			},
		};

		return (await k8sApi.createNamespacedService(namespace, service)).body;
	}
}