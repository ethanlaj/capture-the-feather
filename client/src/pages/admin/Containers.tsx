import ChallengeExpiresIn from "@/components/admin/ChallengeExpiresIn";
import { ChallengeService } from "@/services/challengeService";
import { Challenge } from "@/types/Challenge";
import { UserContainerWithK8Data } from "@/types/UserContainer";
import { CheckCircleFilled, ExclamationCircleFilled, ReloadOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

const Containers = () => {
	const [containers, setContainers] = useState<UserContainerWithK8Data[]>([]);

	useEffect(() => {
		getContainers();
	}, []);

	async function getContainers() {
		const userContainers = await ChallengeService.getChallengeContainers();
		setContainers(userContainers);
	}

	async function handleReload() {
		await getContainers();
	}

	const columns: ColumnsType<UserContainerWithK8Data> = [
		{
			title: "Challenge Name",
			dataIndex: "challenge",
			key: "challengeName",
			filters: containers.map((container) => ({
				text: container.challenge.title,
				value: container.challenge.title,
			})),
			onFilter: (value, record) => record.challenge.title === value,
			render: (challenge: Challenge) => challenge.title,
		},
		{
			title: "Challenge Category",
			dataIndex: "challenge",
			key: "challengeCategory",
			filters: containers.map((container) => ({
				text: container.challenge.category,
				value: container.challenge.category,
			})),
			onFilter: (value, record) => record.challenge.category === value,
			render: (challenge: Challenge) => challenge.category,
		},
		{
			title: "Is Deployment Ready",
			dataIndex: "isDeploymentReady",
			key: "isDeploymentReady",
			filters: [
				{ text: "Ready", value: true },
				{ text: "Not Ready", value: false },
			],
			onFilter: (value, record) => record.isDeploymentReady === value,
			render: (isDeploymentReady: boolean) =>
				isDeploymentReady ? (
					<CheckCircleFilled className="text-xl text-green-500" />
				) : (
					<ExclamationCircleFilled className="text-xl text-red-500" />
				),
		},
		{
			title: "Expires In",
			dataIndex: "expiresAt",
			key: "expiresIn",
			sorter: (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime(),
			render: (expiresAt: string) => <ChallengeExpiresIn expiresAt={expiresAt} />,
		},
	];

	return (
		<Table
			title={() => (
				<div className="flex items-center justify-center gap-3">
					<h1 className="text-center">Containers</h1>
					<Button icon={<ReloadOutlined />} onClick={() => handleReload()}></Button>
				</div>
			)}
			bordered
			dataSource={containers}
			columns={columns}
			pagination={false}
			rowKey={(record) => record.challengeId + "-" + record.userId}
		/>
	);
};

export default Containers;
