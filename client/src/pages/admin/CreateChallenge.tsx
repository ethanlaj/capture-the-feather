import { useState } from "react";
import { Button, Checkbox, Form, Input, InputNumber, Radio } from "antd";
import ReactQuill from "react-quill";
import TextArea from "antd/es/input/TextArea";
import { useForm, useWatch } from "antd/es/form/Form";
import FormItemWithSublabel from "@/components/FormItemWithSubLabel";
import StaticPointQs from "@/components/admin/CreateChallengeForm/StaticPointQs";
import DynamicPointQs from "@/components/admin/CreateChallengeForm/DynamicPointQs";
import MultipleChoiceQs from "@/components/admin/CreateChallengeForm/MultipleChoiceQs";
import ShortAnswerQs from "@/components/admin/CreateChallengeForm/ShortAnswerQs";
import ContainerQs from "@/components/admin/CreateChallengeForm/ContainerQs";
import { PointsType } from "@/types/Challenge";
import { ChallengeService } from "@/services/challengeService";
import { ClientError } from "@/types/ClientError";

const CreateChallenge = () => {
	const [description, setDescription] = useState("");
	const [form] = useForm();

	const pointsType = useWatch("pointsType", form);
	const challengeType = useWatch("challengeType", form);
	const isContainer = useWatch("isContainer", form);

	const onFinish = async (values: any) => {
		const challenge = {
			category: values.category,
			title: values.title,
			shortDescription: values.shortDescription,
			description: description,
			type: values.challengeType,
			pointsType: values.pointsType,
			points: values.points,
			maxAttempts: values.maxAttempts,
			...(values.pointsType === PointsType.Dynamic
				? {
						minPoints: values.minPoints,
						decay: values.decay,
				  }
				: {}),
			isContainer: values.isContainer,
			...(values.isContainer
				? {
						containerImage: values.containerImage,
						containerPorts: values.containerPorts.map((port: number) => port),
						containerInstructions: values.containerInstructions,
				  }
				: {}),
			challengeType: values.challengeType,
			...(values.challengeType === "multiple-choice"
				? {
						multipleChoiceOptions: values.multipleChoiceOptions.map((option: any) => {
							return {
								value: option.option,
								isCorrect: option.isCorrect,
							};
						}),
				  }
				: {}),
			...(values.challengeType === "short-answer"
				? {
						shortAnswerOptions: values.shortAnswerOptions.map((option: any) => {
							return {
								value: option.option,
								isCorrect: option.isCorrect,
								isCaseSensitive: option.isCaseSensitive,
								matchMode: option.isRegularExpression ? "regex" : "static",
								regExp: option.regExp,
							};
						}),
				  }
				: {}),
		};

		try {
			await ChallengeService.createChallenge(challenge);
		} catch (error) {
			console.log(error);
			new ClientError(error).toast();
		}
	};

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

				<Form.Item
					label="Description"
					name="description"
					rules={[
						{ required: true },
						{
							validator: (_, value) => {
								// create a new element to check if the value is just an empty paragraph
								const temp = document.createElement("div");
								temp.innerHTML = value;
								value = temp.textContent || temp.innerText || "";

								if (value.trim() === "") {
									return Promise.reject("'description' is required");
								}
								return Promise.resolve();
							},
						},
					]}
				>
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

				{isContainer ? <ContainerQs /> : null}

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
