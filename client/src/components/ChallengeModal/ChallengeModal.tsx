import { Modal } from "antd";
import {
	Challenge,
	ChallengeType,
	MultipleChoiceChallenge,
	ShortAnswerChallenge,
} from "../../types/Challenge";
import MultipleChoice from "./MultipleChoice";
import { useState } from "react";
import ShortAnswer from "./ShortAnswer";

interface Props {
	challenge?: Challenge;
	isOpen: boolean;
	handleOk: () => void;
	handleCancel: () => void;
}

const ChallengeModal = ({ challenge, isOpen, handleOk, handleCancel }: Props) => {
	const [userAnswer, setUserAnswer] = useState<any>();

	const onClose = () => {
		setUserAnswer(undefined);
		handleCancel();
	};

	if (!challenge) return null;

	return (
		<Modal title={challenge.title} open={isOpen} onOk={handleOk} onCancel={onClose}>
			<p>{challenge.description}</p>

			{/* Challenge Types */}
			{isMultipleChoiceChallenge(challenge) && (
				<MultipleChoice
					options={challenge.multipleChoiceOptions}
					userAnswer={userAnswer}
					handleUserAnswerChange={setUserAnswer}
				/>
			)}
			{isShortAnswerChallenge(challenge) && (
				<ShortAnswer userAnswer={userAnswer} handleUserAnswerChange={setUserAnswer} />
			)}
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
