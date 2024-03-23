import { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Challenge } from "@/types/Challenge";
import { ChallengeService } from "@/services/challengeService";
import { useNavigate } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import ChallengeActions from "@/components/admin/ChallengeActions";
import { ClientError } from "@/types/ClientError";

const Challenges = () => {
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function getChallenges() {
			const data = await ChallengeService.getChallenges(true);
			setChallenges(data);
		}

		getChallenges();
	}, []);

	function handleCreateChallenge() {
		navigate("/admin/challenges/create");
	}

	function handleDelete(challengeId: number) {
		try {
			ChallengeService.deleteChallenge(challengeId);
			setChallenges(challenges.filter((c) => c.id !== challengeId));
		} catch (error) {
			console.error(error);
			new ClientError(error).toast();
		}
	}

	const columns: ColumnsType<Challenge> = [
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			render: (type: string) => {
				switch (type) {
					case "multiple-choice":
						return "Multiple Choice";
					case "short-answer":
						return "Short Answer";
					default:
						return "Unknown";
				}
			},
		},
		{
			title: "",
			key: "actions",
			render: (challenge: Challenge) => (
				<ChallengeActions handleDelete={handleDelete} challenge={challenge} />
			),
		},
	];

	return (
		<>
			<Button
				type="primary"
				icon={<PlusOutlined />}
				className="mb-4"
				onClick={() => handleCreateChallenge()}
			>
				Create
			</Button>
			<Table pagination={false} dataSource={challenges} columns={columns} rowKey="id" />
		</>
	);
};

export default Challenges;
