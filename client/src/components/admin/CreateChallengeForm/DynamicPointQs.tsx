import { Alert, InputNumber } from "antd";
import FormItemWithSublabel from "../../FormItemWithSubLabel";

const DynamicPointQs = () => {
	return (
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
				<InputNumber style={{ width: "100%" }} min={0} placeholder="Enter initial points" />
			</FormItemWithSublabel>

			<FormItemWithSublabel
				label="Minimum Points"
				subLabel="The minimum amount of points that can be awarded to a user who solves the challenge correctly."
				name="minPoints"
				rules={[{ required: true }]}
			>
				<InputNumber style={{ width: "100%" }} min={0} placeholder="Enter minimum points" />
			</FormItemWithSublabel>

			<FormItemWithSublabel
				label="Decay"
				subLabel="The rate at which the number of points awarded to users who solve the challenge correctly decreases."
				name="decay"
				rules={[{ required: true }]}
			>
				<InputNumber style={{ width: "100%" }} min={0} placeholder="Enter rate of decay" />
			</FormItemWithSublabel>
		</>
	);
};

export default DynamicPointQs;
