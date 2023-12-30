import { Form, Input } from "antd";

interface Props {
	userAnswer?: string;
	handleUserAnswerChange: (userAnswer?: string) => void;
}

const MultipleChoice = ({ userAnswer, handleUserAnswerChange }: Props) => {
	return (
		<Form layout="vertical">
			<Form.Item label="Your Answer">
				<Input
					value={userAnswer}
					onChange={(e) => handleUserAnswerChange(e.target.value)}
				/>
			</Form.Item>
		</Form>
	);
};

export default MultipleChoice;
