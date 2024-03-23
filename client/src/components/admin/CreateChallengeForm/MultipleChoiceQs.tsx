import { Button, Checkbox, Form, Input } from "antd";
import { useRef } from "react";

const MultipleChoiceQs = () => {
	const nextKeyRef = useRef(4);

	return (
		<Form.Item
			name="multipleChoiceOptions"
			label="Multiple Choice Options"
			rules={[
				{ required: true },
				{
					validator: (_, value) => {
						const correctOptions = value.filter((option: any) => option.isCorrect);
						if (correctOptions.length === 0) {
							return Promise.reject("At least one option must be correct");
						}

						if (correctOptions.length > 1) {
							return Promise.reject("Only one option can be correct");
						}

						return Promise.resolve();
					},
				},
			]}
		>
			<Form.List
				key="multipleChoiceOptions"
				name="multipleChoiceOptions"
				initialValue={[
					{ name: 0, key: 0 },
					{ name: 1, key: 1 },
					{ name: 2, key: 2 },
					{ name: 3, key: 3 },
				]}
			>
				{(fields, { add, remove }) => (
					<>
						{fields.map((field) => (
							<div key={field.key} className="flex gap-2 w-full">
								<Form.Item
									name={[field.name, "isCorrect"]}
									valuePropName="checked"
									initialValue={false}
									className="mb-2"
								>
									<Checkbox />
								</Form.Item>
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
								<Button
									danger
									disabled={fields.length <= 4}
									onClick={() => remove(field.name)}
								>
									Remove
								</Button>
							</div>
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
					</>
				)}
			</Form.List>
		</Form.Item>
	);
};

export default MultipleChoiceQs;
