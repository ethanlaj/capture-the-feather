import { Radio, RadioChangeEvent, Space } from "antd";
import { MultipleChoiceOption } from "../../types/Challenge";
import { Attempt } from "@/types/Attempt";

interface Props {
	options: MultipleChoiceOption[];
	attempts: Attempt[];
	userAnswer?: string;
	handleUserAnswerChange: (userAnswer?: string) => void;
}

const MultipleChoice = ({ options, attempts, userAnswer, handleUserAnswerChange }: Props) => {
	const handleChange = (e: RadioChangeEvent) => {
		const optionId = e.target.value;
		const option = options.find((option) => option.id === optionId);
		handleUserAnswerChange(option!.id.toString());
	};

	return (
		<Radio.Group value={parseInt(userAnswer!)} onChange={handleChange}>
			<Space direction="vertical">
				{options.map((option) => {
					const isIncorrect = attempts.find(
						(attempt) =>
							parseInt(attempt.multipleChoiceOptionId) === option.id &&
							!attempt.isCorrect
					);

					return (
						<Radio key={option.id} value={option.id} disabled={isIncorrect != null}>
							{option.value}
						</Radio>
					);
				})}
			</Space>
		</Radio.Group>
	);
};

export default MultipleChoice;
