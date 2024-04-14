import { useEffect, useState } from "react";
import { useWindowSize } from "@react-hook/window-size";
import { Button, Card, Divider, notification } from "antd";
import ChallengeModal from "../components/ChallengeModal/ChallengeModal";
import {
	DndContext,
	closestCenter,
	MouseSensor,
	useSensor,
	useSensors,
	DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Challenge } from "../types/Challenge";
import { ChallengeService } from "@/services/challengeService";
import _ from "lodash";
import { ClientError } from "@/types/ClientError";
import Confetti from "react-confetti";
import { SubmitAttemptResponse } from "@/services/attemptService";
import { useNavigate } from "react-router-dom";
import SortableItem from "@/components/SortableItem";
import { useUser } from "@/contexts/UserContext";
import { ConfigurationService } from "@/services/configurationService";

interface Category {
	name: string;
	challenges: Challenge[];
}

function ChallengesView() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const userContext = useUser();
	const [selectedChallenge, setSelectedChallenge] = useState<Challenge | undefined>();
	const [categories, setCategories] = useState<Category[]>([]);
	const [isConfettiActive, setIsConfettiActive] = useState(false);
	const [width, height] = useWindowSize();
	const navigate = useNavigate();
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 100,
				tolerance: 5,
			},
		})
	);

	const isAdmin = userContext?.user?.isAdmin || false;

	useEffect(() => {
		async function getChallenges() {
			try {
				const response = await ChallengeService.getChallengesAsUser();
				const categories = _.groupBy(response.challenges, "category");

				const categoriesArray: Category[] = [];
				for (const category in categories) {
					const challenges = categories[category];
					categoriesArray.push({
						name: category,
						challenges: challenges.sort((a, b) => a.order - b.order),
					});
				}

				const categoryOrder = response.categoryOrder;
				if (categoryOrder) {
					categoriesArray.sort((a, b) => {
						const aIndex = categoryOrder.indexOf(a.name);
						const bIndex = categoryOrder.indexOf(b.name);
						return aIndex - bIndex;
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
		if (challenge.isSolved) {
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

	const handleCategoryDragEnd = async (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		if (active.id !== over.id) {
			const oldCategories = categories;

			try {
				const newCategories = arrayMove(
					categories,
					categories.findIndex((category) => category.name === active.id),
					categories.findIndex((category) => category.name === over.id)
				);

				setCategories(newCategories);

				await ConfigurationService.reorderCategories(newCategories.map((c) => c.name));
			} catch (error) {
				setCategories(oldCategories);
				console.log(error);
				new ClientError(error).toast();
			}
		}
	};

	const handleChallengeDragEnd = async (event: DragOverEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const category = categories.find((category) => {
			return category.challenges.find((challenge) => challenge.id === Number(active.id));
		});

		const activeChallengeIndex = category?.challenges.findIndex(
			(challenge) => challenge.id === Number(active.id)
		);
		const overChallengeIndex = category?.challenges.findIndex(
			(challenge) => challenge.id === Number(over.id)
		);

		if (!category || activeChallengeIndex === undefined || overChallengeIndex === undefined) {
			return;
		}

		try {
			const newChallenges = arrayMove(
				category.challenges,
				activeChallengeIndex,
				overChallengeIndex
			);

			await ConfigurationService.reorderChallenges(
				category.name,
				newChallenges.map((c) => c.id)
			);

			// Same category, reorder challenges
			setCategories((categories) => {
				const updatedCategories = categories.map((categoryToMap) => {
					if (categoryToMap.name === category.name) {
						return {
							...category,
							challenges: newChallenges,
						};
					}

					return categoryToMap;
				});

				return updatedCategories;
			});
		} catch (error) {
			console.log(error);
			new ClientError(error).toast();
		}
	};

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleCategoryDragEnd}
			>
				<SortableContext
					disabled={!isAdmin}
					items={categories.map((category) => category.name)}
					strategy={verticalListSortingStrategy}
				>
					{categories.map((category, index) => (
						<SortableItem key={category.name} id={category.name}>
							<div key={category.name} className="mt-4">
								<h2 className="text-left text-xl font-bold">{category.name}</h2>

								<div className="flex flex-wrap justify-start">
									<DndContext
										key={category.name + "Context"}
										sensors={sensors}
										collisionDetection={closestCenter}
										onDragEnd={handleChallengeDragEnd}
									>
										<SortableContext
											disabled={!isAdmin}
											strategy={verticalListSortingStrategy}
											items={category.challenges.map((challenge) =>
												challenge.id.toString()
											)}
										>
											{category.challenges.map((challenge) => (
												<SortableItem
													key={challenge.id}
													id={challenge.id.toString()}
												>
													<Card
														key={challenge.id}
														className={getCardColor(challenge)}
														extra={challenge.points}
														title={challenge.title}
														bordered={false}
														style={{ width: 300, margin: "15px" }}
														onClick={(e) => {
															e.stopPropagation();
															showModal(challenge);
														}}
													>
														{challenge.shortDescription}
													</Card>
												</SortableItem>
											))}
										</SortableContext>
									</DndContext>
								</div>

								{/* Add a divider between categories, except after the last one */}
								{index < categories.length - 1 && (
									<Divider className="border-2 border-gray-300" />
								)}
							</div>
						</SortableItem>
					))}
				</SortableContext>
			</DndContext>
			<ChallengeModal
				challenge={selectedChallenge}
				isOpen={isModalOpen}
				onChallengeAttempted={handleChallengeUpdated}
				handleCancel={handleCancel}
			/>
			{isConfettiActive && (
				<div className="confetti fixed top-0 left-0">
					<Confetti recycle={false} width={width} height={height} />
				</div>
			)}
		</>
	);
}

export default ChallengesView;
