import { useState, useEffect } from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { AttemptService } from "@/services/attemptService";
import { AttemptAdmin } from "@/types/Attempt";
import { FaCheck } from "react-icons/fa";
import { MultipleChoiceChallenge } from "@/types/Challenge";
import { format } from "date-fns";

const Attempts = () => {
	const [attempts, setAttempts] = useState<AttemptAdmin[]>([]);

	useEffect(() => {
		async function getChallenges() {
			const data = await AttemptService.getAttempts();
			setAttempts(data);
		}

		getChallenges();
	}, []);

	const columns: ColumnsType<AttemptAdmin> = [
		{
			title: "User Name",
			sorter: (a, b) => a.user.name.localeCompare(b.user.name),
			render: (attempt) => attempt.user.name,
			key: "userName",
		},
		{
			title: "Challenge",
			sorter: (a, b) => a.challenge.title.localeCompare(b.challenge.title),
			render: (attempt) => attempt.challenge.title,
			key: "challenge",
		},
		{
			title: "Category",
			sorter: (a, b) => a.challenge.category.localeCompare(b.challenge.category),
			render: (attempt) => attempt.challenge.category,
			key: "category",
		},
		{
			title: "Correct",
			dataIndex: "isCorrect",
			key: "isCorrect",
			filters: [
				{ text: "Correct", value: true },
				{ text: "Incorrect", value: false },
			],
			onFilter: (value, record) => record.isCorrect === value,
			render: (isCorrect: boolean) => {
				if (isCorrect) {
					return <FaCheck />;
				}
			},
		},
		{
			title: "User Answer",
			key: "userAnswer",
			sorter: (a, b) => (a.userAnswer || "").localeCompare(b.userAnswer || ""),
			render: (attempt: AttemptAdmin) => {
				if (attempt.userAnswer) {
					return attempt.userAnswer;
				}

				if (attempt.multipleChoiceOptionId) {
					const option = (
						attempt.challenge as MultipleChoiceChallenge
					).multipleChoiceOptions.find(
						(option) => option.id === attempt.multipleChoiceOptionId
					);
					return option?.value;
				}
			},
		},
		{
			title: "Date",
			key: "date",
			sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			render: (attempt: AttemptAdmin) => {
				return format(new Date(attempt.createdAt), "MMMM do, h:mm:ss aa");
			},
		},
	];

	return (
		<Table
			title={() => <h1 className="text-center">Attempts</h1>}
			bordered
			pagination={false}
			dataSource={attempts}
			columns={columns}
			rowKey="id"
		/>
	);
};

export default Attempts;
