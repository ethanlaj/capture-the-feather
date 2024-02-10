import { Modal } from "antd";
import {
	Challenge,
	ChallengeType,
	MultipleChoiceChallenge,
	ShortAnswerChallenge,
} from "../../types/Challenge";
import MultipleChoice from "./MultipleChoice";
import { useEffect, useState } from "react";
import ShortAnswer from "./ShortAnswer";
import { AttemptService } from "@/services/attemptService";
import { ClientError } from "@/types/ClientError";

interface Props {
	challenge?: Challenge;
	isOpen: boolean;
	onChallengeAttempted: (challenge: Challenge) => void;
	handleCancel: () => void;
}

const ChallengeModal = ({
	challenge: initChallenge,
	isOpen,
	onChallengeAttempted,
	handleCancel,
}: Props) => {
	const [userAnswer, setUserAnswer] = useState<any>();
	const [challenge, setChallenge] = useState<Challenge | undefined>(initChallenge);

	useEffect(() => {
		setChallenge(initChallenge);
	}, [initChallenge]);

	const onClose = () => {
		setUserAnswer(undefined);
		handleCancel();
	};

	const handleSubmit = async () => {
		try {
			const updatedChallenge = await AttemptService.submitAttempt(challenge!.id, userAnswer);
			setUserAnswer(undefined);
			onChallengeAttempted(updatedChallenge);
		} catch (error) {
			new ClientError(error).toast();
		}
	};

	if (!challenge) return null;

	return (
		<Modal
			title={<div className="text-center font-bold">{challenge.title}</div>}
			open={isOpen}
			onOk={handleSubmit}
			okText="Submit"
			onCancel={onClose}
		>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between">
					<div className="text-align-end">{challenge.points} points</div>
					<div className="text-align-end">
						{challenge.attemptsLeft}/{challenge.maxAttempts} attempts remaining
					</div>
				</div>

				<p className="m-0">{challenge.description}</p>
				{/* Challenge Types */}
				{isMultipleChoiceChallenge(challenge) && (
					<MultipleChoice
						attempts={challenge.attempts}
						options={challenge.multipleChoiceOptions}
						userAnswer={userAnswer}
						handleUserAnswerChange={setUserAnswer}
					/>
				)}
				{isShortAnswerChallenge(challenge) && (
					<ShortAnswer userAnswer={userAnswer} handleUserAnswerChange={setUserAnswer} />
				)}
			</div>
		</Modal>
	);
};

function isMultipleChoiceChallenge(challenge: Challenge): challenge is MultipleChoiceChallenge {
	return challenge.type === ChallengeType.MultipleChoice;
}

function isShortAnswerChallenge(challenge: Challenge): challenge is ShortAnswerChallenge {
	return challenge.type === ChallengeType.ShortAnswer;
}

export default ChallengeModal;
