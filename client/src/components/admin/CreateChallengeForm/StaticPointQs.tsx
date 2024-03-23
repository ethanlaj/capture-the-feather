import { Alert, Form, InputNumber } from "antd";

const StaticPointQs = () => {
	return (
		<>
			<Alert
				className="mb-4"
				type="info"
				showIcon
				message="Static point types will award the same amount of points to each user who solves the challenge correctly."
			/>
			<Form.Item label="Points" name="points" rules={[{ required: true }]}>
				<InputNumber
					style={{ width: "100%" }}
					min={0}
					placeholder="Enter challenge points"
				/>
			</Form.Item>
		</>
	);
};

export default StaticPointQs;
