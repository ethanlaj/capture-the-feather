import { useUser } from "@/contexts/UserContext";
import { MeService } from "@/services/meService";
import { ClientError } from "@/types/ClientError";
import { ClientSuccess } from "@/types/ClientSuccess";
import { Form, Input, Button } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
	email: string;
	password: string;
}

const Login = () => {
	const navigate = useNavigate();
	const { user, setUser } = useUser();

	useEffect(() => {
		if (user) {
			navigate("/challenges");
		}
	}, [user, navigate]);

	const onFinish = async (values: FormValues) => {
		try {
			const response = await MeService.login(values);
			MeService.setAccessToken(response.accessToken);
			MeService.setRefreshToken(response.refreshToken);

			setUser(response.user);

			ClientSuccess.toast("Successfully logged in!");

			navigate("/challenges");
		} catch (error) {
			console.log(error);
			new ClientError(error).toast();
		}
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
