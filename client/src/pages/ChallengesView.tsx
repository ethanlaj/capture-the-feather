import { useState } from "react";
import { Card, Divider } from "antd";
import ChallengeModal from "../components/ChallengeModal/ChallengeModal";
import { Challenge, ChallengeType } from "../types/Challenge";

interface Category {
	name: string;
	challenges: Challenge[];
}

const categories: Category[] = [
	{
		name: "Easy",
		challenges: [
			{
				id: 1,
				title: "Challenge 1",
				description: "Description of Challenge 1",
				type: ChallengeType.MultipleChoice,
				multipleChoiceOptions: [
					{
						id: 1,
						value: "Choice A",
					},
					{
						id: 2,
						value: "Choice 2",
					},
					{
						id: 3,
						value: "Choice 3",
					},
					{
						id: 4,
						value: "Choice 4",
					},
				],
			},
		],
	},
	{
		name: "Medium",
		challenges: [
			{
				id: 2,
				title: "Challenge 2",
				description: "Description of Challenge 2",
				type: ChallengeType.ShortAnswer,
			},
		],
	},
	{
		name: "Hard",
		challenges: [
			{
				id: 2,
				title: "Challenge 3",
				description: "Description of Challenge 3",
				type: ChallengeType.MultipleChoice,
				multipleChoiceOptions: [
					{
						id: 1,
						value: "Choice 1",
					},
					{
						id: 2,
						value: "Choice 2",
					},
					{
						id: 3,
						value: "Choice 3",
					},
					{
						id: 4,
						value: "Choice 4",
					},
				],
			},
		],
	},
];

function ChallengesView() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();

	const showModal = (challenge: Challenge) => {
		setSelectedChallenge(challenge);
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{categories.map((category, index) => (
				<div key={category.name} className="mt-4">
					<h2 className="text-left text-xl font-bold">{category.name}</h2>

					<div className="flex flex-wrap justify-start">
						{category.challenges.map((challenge) => (
							<Card
								key={challenge.id}
								title={challenge.title}
								bordered={false}
								style={{ width: 300, margin: "15px" }}
								onClick={() => showModal(challenge)}
							>
								{challenge.description}
							</Card>
						))}
					</div>

					{/* Add a divider between categories, except after the last one */}
					{index < categories.length - 1 && (
						<Divider className="border-2 border-gray-300" />
					)}
				</div>
			))}
			<ChallengeModal
				challenge={selectedChallenge}
				isOpen={isModalOpen}
				handleOk={handleOk}
				handleCancel={handleCancel}
			/>
		</>
	);
}

export default ChallengesView;
