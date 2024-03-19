import { Button, Form } from "antd";
import ShortAnswerListItem from "./ShortAnswerListItem";
import { useRef } from "react";

const ShortAnswerQs = () => {
	const nextKeyRef = useRef(1);

	return (
		<Form.Item
			name="shortAnswerOptions"
			label="Short Answer Options"
			rules={[{ required: true }]}
		>
			<Form.List
				key="shortAnswerOptions"
				name="shortAnswerOptions"
				initialValue={[{ name: 0, key: 0 }]}
			>
				{(fields, { add, remove }) => (
					<div className="flex flex-col gap-2">
						{fields.map((field) => (
							<ShortAnswerListItem
								key={field.key}
								field={field}
								isRemoveVisible={fields.length > 1}
								remove={remove}
							/>
						))}
						<Button
							type="dashed"
							onClick={() => {
								add(
									{ name: nextKeyRef.current, key: nextKeyRef.current },
									fields.length
								);
								nextKeyRef.current += 1;
							}}
							block
						>
							+ Add Option
						</Button>
					</div>
				)}
			</Form.List>
		</Form.Item>
	);
};

export default ShortAnswerQs;
