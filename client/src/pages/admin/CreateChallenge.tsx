import { useCallback, useEffect, useState } from "react";
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
import {
	ChallengeType,
	MultipleChoiceChallenge,
	PointsType,
	ShortAnswerChallenge,
} from "@/types/Challenge";
import { ChallengeService } from "@/services/challengeService";
import { ClientError } from "@/types/ClientError";
import { useNavigate, useParams } from "react-router-dom";

interface CreateChallengeForm {
	title: string;
	category: string;
	shortDescription: string;
	description: string;
	pointsType: PointsType;
	points: number;
	maxAttempts: number;
	minPoints: number;
	decay: number;
	isContainer: boolean;
	containerImage: string;
	containerPorts: {
		key: number;
		name: number;
		port: number;
	}[];
	containerInstructions: string;
	challengeType: ChallengeType;
	multipleChoiceOptions: {
		key: number;
		name: number;
		option: string;
		isCorrect: boolean;
	}[];
	shortAnswerOptions: {
		key: number;
		name: number;
		option: string;
		isCorrect: boolean;
		isCaseSensitive: boolean;
		isRegularExpression: boolean;
		regExp: string;
	}[];
}

const CreateChallenge = () => {
	const [description, setDescription] = useState("");
	const navigate = useNavigate();
	const [form] = useForm<CreateChallengeForm>();
	const idStr = useParams().id;
	const id = idStr ? parseInt(idStr) : null;

	const pointsType = useWatch("pointsType", form);
	const challengeType = useWatch("challengeType", form);
	const isContainer = useWatch("isContainer", form);

	const onFinish = async (values: CreateChallengeForm) => {
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
						containerPorts: values.containerPorts.map((port) => port.port),
						containerInstructions: values.containerInstructions,
				  }
				: {}),
			challengeType: values.challengeType,
			...(values.challengeType === "multiple-choice"
				? {
						multipleChoiceOptions: values.multipleChoiceOptions.map((option: any) => {
							return {
								id: option.key,
								value: option.option,
								isCorrect: option.isCorrect,
								isNew: option.isNew,
							};
						}),
				  }
				: {}),
			...(values.challengeType === "short-answer"
				? {
						shortAnswerOptions: values.shortAnswerOptions.map((option: any) => {
							return {
								id: option.key,
								value: option.option,
								isCorrect: option.isCorrect,
								isCaseSensitive: option.isCaseSensitive,
								matchMode: option.isRegularExpression ? "regex" : "static",
								regExp: option.regExp,
								isNew: option.isNew,
							};
						}),
				  }
				: {}),
		};

		try {
			if (id) {
				await ChallengeService.updateChallenge(id, challenge);
			} else {
				await ChallengeService.createChallenge(challenge);
			}
		} catch (error) {
			console.log(error);
			new ClientError(error).toast();
		}
	};

	const getChallenge = useCallback(
		async (id: number) => {
			const result = await ChallengeService.getChallenge(id);
			form.setFieldsValue({
				...result,
				challengeType: result.type,
				shortAnswerOptions: (result as ShortAnswerChallenge).shortAnswerOptions?.map(
					(option) => {
						return {
							key: option.id,
							name: option.id,
							option: option.value,
							isCaseSensitive: option.isCaseSensitive,
							isRegularExpression: option.matchMode === "regex",
						};
					}
				),
				multipleChoiceOptions: (
					result as MultipleChoiceChallenge
				).multipleChoiceOptions?.map((option) => {
					return {
						key: option.id,
						name: option.id,
						option: option.value,
						isCorrect: option.isCorrect,
					};
				}),
			});
		},
		[form]
	);

	useEffect(() => {
		if (id) {
			getChallenge(id);
		}
	}, [form, getChallenge, id]);

	return (
		<>
			<h1 className="text-center">{id ? "Update Challenge" : "Create Challenge"}</h1>
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
					<div className="flex gap-2">
						<Button htmlType="button" onClick={() => navigate("/admin/challenges")}>
							Cancel
						</Button>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</div>
				</Form.Item>
			</Form>
		</>
	);
};

export default CreateChallenge;
