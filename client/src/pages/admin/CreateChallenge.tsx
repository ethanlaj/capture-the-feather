import { useState } from "react";
import { Alert, Button, Form, Input, Radio } from "antd";
import ReactQuill from "react-quill";
import TextArea from "antd/es/input/TextArea";
import { useForm, useWatch } from "antd/es/form/Form";
import FormItemWithSublabel from "@/components/FormItemWithSubLabel";

const CreateChallenge = () => {
	const [description, setDescription] = useState("");
	const [form] = useForm();

	const pointsType = useWatch("pointsType", form);
	const challengeType = useWatch("challengeType", form);

	return (
		<>
			<h1 className="text-center">Create Challenge</h1>
			<Form form={form} layout="vertical">
				<Form.Item label="Title" name="title" rules={[{ required: true }]}>
					<Input showCount maxLength={20} placeholder="Enter challenge title" />
				</Form.Item>

				<Form.Item
					label="Category"
					name="category"
					rules={[{ required: true }, { max: 20 }]}
				>
					<Input showCount maxLength={20} placeholder="Enter challenge category" />
				</Form.Item>

				<Form.Item
					label="Short Description"
					name="shortDescription"
					rules={[{ required: true }, { max: 50 }]}
				>
					<TextArea
						showCount
						maxLength={50}
						placeholder="Enter a short description to be shown on the challenges page"
					/>
				</Form.Item>

				<Form.Item label="Description" name="description" rules={[{ required: true }]}>
					<ReactQuill theme="snow" value={description} onChange={setDescription} />
				</Form.Item>

				<FormItemWithSublabel
					label="Max Attempts"
					subLabel="Enter 0 for unlimited attempts."
					name="maxAttempts"
					rules={[{ required: true }]}
				>
					<Input type="number" placeholder="Enter max number of attempts" />
				</FormItemWithSublabel>

				<Form.Item label="Points Type" name="pointsType" rules={[{ required: true }]}>
					<Radio.Group>
						<Radio value="static">Static</Radio>
						<Radio value="dynamic">Dynamic</Radio>
					</Radio.Group>
				</Form.Item>

				{pointsType === "static" ? (
					<>
						<Alert
							className="mb-4"
							type="info"
							showIcon
							message="Static point types will award the same amount of points to each user who solves the challenge correctly."
						/>
						<Form.Item label="Points" name="points" rules={[{ required: true }]}>
							<Input type="number" placeholder="Enter challenge points" />
						</Form.Item>
					</>
				) : pointsType === "dynamic" ? (
					<>
						<Alert
							className="mb-4"
							type="info"
							showIcon
							message="Dynamic point types will award a variable amount of points to each user who solves the challenge correctly. The number of points awarded will decrease as more users solve the challenge."
						/>
						<FormItemWithSublabel
							label="Initial Points"
							subLabel="The initial amount of points awarded to the first user who solves the challenge correctly."
							name="points"
							rules={[{ required: true }]}
						>
							<Input type="number" placeholder="Enter initial points" />
						</FormItemWithSublabel>

						<FormItemWithSublabel
							label="Minimum Points"
							subLabel="The minimum amount of points that can be awarded to a user who solves the challenge correctly."
							name="minPoints"
							rules={[{ required: true }]}
						>
							<Input type="number" placeholder="Enter minimum points" />
						</FormItemWithSublabel>

						<FormItemWithSublabel
							label="Decay"
							subLabel="The rate at which the number of points awarded to users who solve the challenge correctly decreases."
							name="decay"
							rules={[{ required: true }]}
						>
							<Input type="number" placeholder="Enter rate of decay" />
						</FormItemWithSublabel>
					</>
				) : null}

				<Form.Item label="Challenge Type" name="challengeType" rules={[{ required: true }]}>
					<Radio.Group>
						<Radio value="short-answer">Short Answer</Radio>
						<Radio value="multiple-choice">Multiple Choice</Radio>
					</Radio.Group>
				</Form.Item>

				{challengeType === "multiple-choice" ? (
					<Form.Item
						label="Multiple Choice Options"
						rules={[{ required: true }, { min: 4 }]}
					>
						<Form.List name="multipleChoiceOptions" initialValue={[]}>
							{(fields, { add, remove }) => (
								<div>
									{fields.map((field) => (
										<div className="flex gap-2 w-full">
											<Form.Item {...field} className="mb-2 w-full">
												<Input placeholder="Enter option" />
											</Form.Item>
											<Button danger onClick={() => remove(field.name)}>
												Remove
											</Button>
										</div>
									))}
									<Button type="dashed" onClick={() => add()} block>
										+ Add Option
									</Button>
								</div>
							)}
						</Form.List>
					</Form.Item>
				) : challengeType === "short-answer" ? (
					<div>SA</div>
				) : null}

				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default CreateChallenge;
