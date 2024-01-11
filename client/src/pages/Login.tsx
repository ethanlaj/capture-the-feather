import { Form, Input, Button } from "antd";

interface FormValues {
	email: string;
	password: string;
}

const Login = () => {
	const onFinish = (values: FormValues) => {
		console.log("Success:", values);
	};

	return (
		<div className="bg-white px-8 py-4 m-auto max-w-5xl">
			<h2 className="mb-5">Login</h2>
			<Form
				layout="vertical"
				initialValues={{ remember: true }}
				onFinish={onFinish}
				autoComplete="off"
			>
				<Form.Item
					label="Email"
					name="email"
					rules={[{ required: true }, { type: "email" }]}
				>
					<Input />
				</Form.Item>

				<Form.Item label="Password" name="password" rules={[{ required: true }]}>
					<Input.Password />
				</Form.Item>

				<Form.Item className="mt-10">
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Login;
