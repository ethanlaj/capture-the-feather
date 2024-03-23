import { Card, Checkbox, Flex, Form, FormListFieldData, Input } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

interface Props {
	field: FormListFieldData;
	isRemoveVisible: boolean;
	remove: (name: number) => void;
}

const ShortAnswerListItem = ({ field, isRemoveVisible, remove }: Props) => {
	return (
		<Card className="relative">
			{isRemoveVisible && (
				<CloseCircleOutlined
					className="absolute right-3 top-3 text-xl text-red-400"
					onClick={() => remove(field.name)}
				/>
			)}
			<Flex>
				<Form.Item
					valuePropName="checked"
					initialValue={false}
					name={[field.name, "isCaseSensitive"]}
					className="mb-2 w-full"
				>
					<Checkbox>Case Sensitive?</Checkbox>
				</Form.Item>
				<Form.Item
					valuePropName="checked"
					initialValue={false}
					name={[field.name, "isRegularExpression"]}
					className="mb-2 w-full"
				>
					<Checkbox>Regular Expression?</Checkbox>
				</Form.Item>
			</Flex>
			<Form.Item
				name={[field.name, "option"]}
				className="mb-2 w-full"
				rules={[
					{
						required: true,
						message: "'option' is required",
					},
				]}
			>
				<Input placeholder="Enter option" />
			</Form.Item>
		</Card>
	);
};

export default ShortAnswerListItem;
