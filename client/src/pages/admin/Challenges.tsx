import { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Challenge } from "@/types/Challenge";
import { ChallengeService } from "@/services/challengeService";
import { useNavigate } from "react-router-dom";
import { ColumnsType } from "antd/es/table";

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
	];

	return (
		<div className="p-4">
			<Button
				type="primary"
				icon={<PlusOutlined />}
				className="mb-4"
				onClick={() => handleCreateChallenge()}
			>
				Create
			</Button>
			<Table pagination={false} dataSource={challenges} columns={columns} rowKey="id" />
		</div>
	);
};

export default Challenges;
