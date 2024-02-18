import { Alert, Divider, Modal } from "antd";
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
	onChallengeAttempted: (challenge: Challenge) => boolean;
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
	const [showIncorrectAnswerAlert, setShowIncorrectAnswerAlert] = useState(false);

	useEffect(() => {
		setChallenge(initChallenge);
	}, [initChallenge]);

	const onClose = () => {
		setUserAnswer(undefined);
		setShowIncorrectAnswerAlert(false);
		handleCancel();
	};

	const handleSubmit = async () => {
		try {
			const updatedChallenge = await AttemptService.submitAttempt(challenge!.id, userAnswer);
			setUserAnswer(undefined);
			const isSolved = onChallengeAttempted(updatedChallenge);
			setShowIncorrectAnswerAlert(!isSolved);
		} catch (error) {
			new ClientError(error).toast();
		}
	};

	function convertTextToHtml(description: string): string {
		return description.replace(/\n/g, "<br>");
	}

	if (!challenge) return null;

	const attemptsRemainingText =
		(challenge.maxAttempts === 0 ? "∞" : `${challenge.attemptsLeft}/${challenge.maxAttempts}`) +
		" attempts remaining";

	return (
		<Modal
			title={<div className="text-center font-bold">{challenge.title}</div>}
			open={isOpen}
			onOk={handleSubmit}
			okText="Submit"
			onCancel={onClose}
			width="90%"
		>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between">
					<div className="text-align-end">{challenge.points} points</div>
					<div className="text-align-end">{attemptsRemainingText}</div>
				</div>

				<div
					dangerouslySetInnerHTML={{ __html: convertTextToHtml(challenge.description) }}
				/>

				<Divider className="m-1" />
				{showIncorrectAnswerAlert && (
					<Alert type="error" message={`Incorrect answer. ${attemptsRemainingText}`} />
				)}

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
