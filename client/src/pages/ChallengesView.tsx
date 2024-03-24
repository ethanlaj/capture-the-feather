import { useEffect, useState } from "react";
import { useWindowSize } from "@react-hook/window-size";
import { Button, Card, Divider, notification } from "antd";
import ChallengeModal from "../components/ChallengeModal/ChallengeModal";
import { Challenge } from "../types/Challenge";
import { ChallengeService } from "@/services/challengeService";
import _ from "lodash";
import { ClientError } from "@/types/ClientError";
import Confetti from "react-confetti";
import { SubmitAttemptResponse } from "@/services/attemptService";
import { useNavigate } from "react-router-dom";

interface Category {
	name: string;
	challenges: Challenge[];
}

function ChallengesView() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();
	const [categories, setCategories] = useState<Category[]>([]);
	const [isConfettiActive, setIsConfettiActive] = useState(false);
	const [width, height] = useWindowSize();
	const navigate = useNavigate();

	useEffect(() => {
		async function getChallenges() {
			try {
				const response = await ChallengeService.getChallenges(false);
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

	const getCardColor = (challenge: Challenge) => {
		if (!challenge.isSolvedOrExhausted) {
			return "";
		}

		if (challenge.isSolved) {
			return "bg-green-200";
		} else {
			return "bg-red-200";
		}
	};

	const handleChallengeUpdated = (submitResponse: SubmitAttemptResponse) => {
		const challenge = submitResponse.challenge;

		const updatedCategories = categories.map((category) => {
			const updatedChallenges = category.challenges.map((c) => {
				if (c.id === challenge.id) {
					return challenge;
				}
				return c;
			});

			return { ...category, challenges: updatedChallenges };
		});

		setCategories(updatedCategories);

		setSelectedChallenge(challenge);
		if (challenge.isSolvedOrExhausted) {
			setIsModalOpen(false);
		}

		if (challenge.isSolved) {
			setIsConfettiActive(true);
			setTimeout(() => {
				setIsConfettiActive(false);
			}, 3000);

			for (const badge of submitResponse.badges!) {
				notification.open({
					message: "New Badge Awarded",
					type: "success",
					btn: (
						<Button type="primary" onClick={() => navigate("/badges")}>
							View
						</Button>
					),
					description: `You have earned the ${badge.name} badge!`,
					icon: <img src={badge.imageUrl} alt={badge.name} width={24} height={24} />,
				});
			}
		}

		return challenge.isSolved;
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
								className={getCardColor(challenge)}
								extra={challenge.points}
								title={challenge.title}
								bordered={false}
								style={{ width: 300, margin: "15px" }}
								onClick={() => showModal(challenge)}
							>
								{challenge.shortDescription}
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
				onChallengeAttempted={handleChallengeUpdated}
				handleCancel={handleCancel}
			/>
			{isConfettiActive && (
				<div className="fixed top-0 left-0 w-full h-full">
					<Confetti recycle={false} width={width} height={height} />
				</div>
			)}
		</>
	);
}

export default ChallengesView;
