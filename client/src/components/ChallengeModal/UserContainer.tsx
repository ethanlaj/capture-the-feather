import { ChallengeService } from "@/services/challengeService";
import { Challenge } from "@/types/Challenge";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Statistic } from "antd";
import { useEffect, useState } from "react";
import { formatDuration, intervalToDuration } from "date-fns";
import { UserContainer as UserContainerType } from "@/types/UserContainer";
import { ClientError } from "@/types/ClientError";

interface Props {
	challenge: Challenge;
}

const UserContainer = ({ challenge }: Props) => {
	const [currentContainer, setCurrentContainer] = useState<UserContainerType | null>(null);
	const [isStartingOrStopping, setIsStartingOrStopping] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

	useEffect(() => {
		async function getUserContainer() {
			const data = await ChallengeService.getChallengeContainer(challenge.id);
			setCurrentContainer(data);
		}

		getUserContainer();
	}, [challenge.id]);

	useEffect(() => {
		const getAndSetTimeRemaining = () => {
			const time = formatTime();
			setTimeRemaining(time);
		};

		const formatTime = () => {
			if (!currentContainer) return "00:00:00";

			const duration = intervalToDuration({
				start: new Date(),
				end: new Date(currentContainer.expiresAt),
			});

			return formatDuration(duration);
		};

		let interval = null;
		if (currentContainer) {
			getAndSetTimeRemaining();
			interval = setInterval(getAndSetTimeRemaining, 1000);
		} else if (!currentContainer && interval) {
			clearInterval(interval);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [currentContainer]);

	const startContainer = async () => {
		try {
			setIsStartingOrStopping(true);
			const newContainer = await ChallengeService.startChallengeContainer(challenge.id);
			setCurrentContainer(newContainer);
		} catch (error) {
			console.error(error);
			new ClientError(error).toast();
		} finally {
			setIsStartingOrStopping(false);
		}
	};

	const stopContainer = async () => {
		try {
			setIsStartingOrStopping(true);
			await ChallengeService.stopChallengeContainer(challenge.id);
			setCurrentContainer(null);
		} catch (error) {
			console.error(error);
			new ClientError(error).toast();
		} finally {
			setIsStartingOrStopping(false);
		}
	};

	return (
		<Card className="bg-gray-50 shadow rounded">
			{!currentContainer && (
				<p className="m-0">
					This challenge launches a container on demand, but there is currently no
					container running. You may need to start the container to solve the challenge.
					Click the start button below to start the container.
				</p>
			)}
			{currentContainer && (
				<div className="flex flex-col gap-3">
					<Statistic
						title="Time Remaining"
						value={timeRemaining || "00:00:00"}
						loading={timeRemaining == null}
					/>
					<Alert
						message="Access Instructions"
						description={ChallengeService.formatContainerAccessInstructions(
							challenge.containerInstructions,
							currentContainer
						)}
						type="info"
						showIcon
					/>
				</div>
			)}
			<div className="mt-4">
				<Button
					danger={currentContainer != null}
					type="primary"
					loading={isStartingOrStopping}
					icon={
						currentContainer != null ? <PauseCircleOutlined /> : <PlayCircleOutlined />
					}
					onClick={currentContainer != null ? stopContainer : startContainer}
					className="w-full"
				>
					{currentContainer != null ? "Stop" : "Start"}
				</Button>
			</div>
		</Card>
	);
};

export default UserContainer;
