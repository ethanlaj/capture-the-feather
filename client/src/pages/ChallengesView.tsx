import { useState } from "react";
import { Card, Divider, Modal } from "antd";

interface Category {
	name: string;
	challenges: Challenge[];
}

interface Challenge {
	id: number;
	title: string;
	description: string;
}

const categories: Category[] = [
	{
		name: "Easy",
		challenges: [{ id: 1, title: "Challenge 1", description: "Description of Challenge 1" }],
	},
	{
		name: "Medium",
		challenges: [{ id: 2, title: "Challenge 2", description: "Description of Challenge 2" }],
	},
	{
		name: "Hard",
		challenges: [{ id: 2, title: "Challenge 3", description: "Description of Challenge 3" }],
	},
	{
		name: "Expert",
		challenges: [{ id: 2, title: "Challenge 4", description: "Description of Challenge 4" }],
	},
];

function ChallengesView() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

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
			<Modal
				title={selectedChallenge?.title}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<p>{selectedChallenge?.description}</p>
				{/* Challenge details and submission form */}
			</Modal>
		</>
	);
}

export default ChallengesView;
