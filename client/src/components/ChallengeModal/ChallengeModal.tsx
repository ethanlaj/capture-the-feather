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

	const handleSubmit = () => {};

	if (!challenge) return null;

	return (
		<Modal
			title={<div className="text-center font-bold">{challenge.title}</div>}
			open={isOpen}
			onOk={handleOk}
			okText="Submit"
			onCancel={onClose}
		>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between">
					<div className="text-align-end">{challenge.points} points</div>
					<div className="text-align-end">1 attempt remaining</div>
				</div>

				<p className="m-0">{challenge.description}</p>
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
