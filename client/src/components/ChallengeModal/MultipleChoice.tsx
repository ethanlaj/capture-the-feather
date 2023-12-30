import { Radio, RadioChangeEvent, Space } from "antd";
import { MultipleChoiceOption } from "../../types/Challenge";

interface Props {
	options: MultipleChoiceOption[];
	userAnswer?: MultipleChoiceOption;
	handleUserAnswerChange: (userAnswer?: MultipleChoiceOption) => void;
}

const MultipleChoice = ({ options, userAnswer, handleUserAnswerChange }: Props) => {
	const handleChange = (e: RadioChangeEvent) => {
		const optionId = e.target.value;
		const option = options.find((option) => option.id === optionId);
		handleUserAnswerChange(option);
	};

	return (
		<Radio.Group value={userAnswer?.id} onChange={handleChange}>
			<Space direction="vertical">
				{options.map((option) => (
					<Radio key={option.id} value={option.id}>
						{option.value}
					</Radio>
				))}
			</Space>
		</Radio.Group>
	);
};

export default MultipleChoice;
