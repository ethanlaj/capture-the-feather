import { useEffect, useState } from "react";
import { Card, Divider } from "antd";
import ChallengeModal from "../components/ChallengeModal/ChallengeModal";
import { Challenge } from "../types/Challenge";
import { ChallengeService } from "@/services/challengeService";
import _ from "lodash";
import { ClientError } from "@/types/ClientError";

interface Category {
	name: string;
	challenges: Challenge[];
}

function ChallengesView() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		async function getChallenges() {
			try {
				const response = await ChallengeService.getChallenges();
				const categories = _.groupBy(response, "category");

				const categoriesArray: Category[] = [];
				for (const category in categories) {
					const challenges = categories[category];
					categoriesArray.push({
						name: category,
						challenges: challenges,
					});
				}

				setCategories(categoriesArray);
			} catch (error) {
				console.log(error);
				new ClientError(error).toast();
			}
		}

		getChallenges();
	}, []);

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
								extra={challenge.points}
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
