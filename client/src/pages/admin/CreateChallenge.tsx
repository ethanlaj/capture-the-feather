import { useState } from "react";
import { Button, Form, Input, InputNumber, Radio } from "antd";
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

	const onFinish = (values: any) => {
		console.log(values);
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
