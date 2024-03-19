import { useState } from "react";
import { Alert, Button, Checkbox, Form, Input, InputNumber, Radio } from "antd";
import ReactQuill from "react-quill";
import TextArea from "antd/es/input/TextArea";
import { useForm, useWatch } from "antd/es/form/Form";
import FormItemWithSublabel from "@/components/FormItemWithSubLabel";
import StaticPointQs from "@/components/CreateChallengeForm/StaticPointQs";
import DynamicPointQs from "@/components/CreateChallengeForm/DynamicPointQs";
import MultipleChoiceQs from "@/components/CreateChallengeForm/MultipleChoiceQs";
import ShortAnswerQs from "@/components/CreateChallengeForm/ShortAnswerQs";

const CreateChallenge = () => {
	const [description, setDescription] = useState("");
	const [form] = useForm();

	const pointsType = useWatch("pointsType", form);
	const challengeType = useWatch("challengeType", form);
	const isContainer = useWatch("isContainer", form);

	const onFinish = (values: any) => {
		console.log(values);
	};

	console.log({ isContainer });

	return (
		<>
			<h1 className="text-center">Create Challenge</h1>
			<Form form={form} layout="vertical" onFinish={onFinish}>
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
					rules={[{ required: true }, { type: "number", min: 0 }]}
				>
					<InputNumber
						style={{ width: "100%" }}
						min={0}
						placeholder="Enter max number of attempts"
					/>
				</FormItemWithSublabel>

				<Form.Item
					label="Points Type"
					name="pointsType"
					rules={[{ required: true }]}
					className="mb-2"
				>
					<Radio.Group>
						<Radio value="static">Static</Radio>
						<Radio value="dynamic">Dynamic</Radio>
					</Radio.Group>
				</Form.Item>

				{pointsType === "static" ? (
					<StaticPointQs />
				) : pointsType === "dynamic" ? (
					<DynamicPointQs />
				) : null}

				<Form.Item label="Challenge Type" name="challengeType" rules={[{ required: true }]}>
					<Radio.Group>
						<Radio value="short-answer">Short Answer</Radio>
						<Radio value="multiple-choice">Multiple Choice</Radio>
					</Radio.Group>
				</Form.Item>

				{challengeType === "multiple-choice" ? (
					<MultipleChoiceQs />
				) : challengeType === "short-answer" ? (
					<ShortAnswerQs />
				) : null}

				<FormItemWithSublabel
					label="Use Containers?"
					name="isContainer"
					valuePropName="checked"
					initialValue={false}
					subLabel="If checked, this challenge provide each participant with their own Docker container in order to solve the challenge."
				>
					<Checkbox />
				</FormItemWithSublabel>

				{isContainer ? (
					<>
						<FormItemWithSublabel
							label="Container Image"
							name="containerImage"
							subLabel="Example: 'ubuntu:latest' or 'python:3.9'"
							rules={[{ required: true }]}
						>
							<Input placeholder="Enter container image" />
						</FormItemWithSublabel>

						<FormItemWithSublabel
							name="containerPorts"
							rules={[{ required: true }]}
							label="Container Ports"
							subLabel="The ports that need to be exposed to the participant. Example: '80', '8080', '3000'"
						>
							<Form.List name="containerPorts" initialValue={[{ name: 0, key: 0 }]}>
								{(fields, { add, remove }) => (
									<>
										{fields.map((field) => (
											<div key={field.key} className="flex gap-2 w-full">
												<Form.Item
													name={[field.name, "port"]}
													className="mb-2 w-full"
													rules={[
														{
															required: true,
															message: "'port' is required",
														},
													]}
												>
													<InputNumber
														style={{ width: "100%" }}
														placeholder="Enter port"
													/>
												</Form.Item>
												<Button
													danger
													disabled={fields.length <= 1}
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
													{ name: fields.length, key: fields.length },
													fields.length
												);
											}}
											block
										>
											+ Add Port
										</Button>
									</>
								)}
							</Form.List>
						</FormItemWithSublabel>

						<FormItemWithSublabel
							name="containerInstructions"
							label="Container Access Instructions"
							rules={[{ required: true }]}
							subLabelRender={() => (
								<Alert
									className="my-2"
									type="info"
									showIcon
									message={
										<div
											dangerouslySetInnerHTML={{
												__html: "Provide instructions to the participants on how to access their container. Example: 'Visit {addr:port:8080} to access your container.' Use <b>{port:PORT}</b> to dynamically insert the port number or <b>{addr:port:PORT}</b> to dynamically insert the address with the port number.",
											}}
										/>
									}
								/>
							)}
						>
							<Input></Input>
						</FormItemWithSublabel>
					</>
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
