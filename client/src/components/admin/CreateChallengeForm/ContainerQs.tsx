import { useRef } from "react";
import FormItemWithSublabel from "../../FormItemWithSubLabel";
import { Alert, Button, Form, Input, InputNumber } from "antd";

const ContainerQs = () => {
	const nextKeyRef = useRef(1);

	return (
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
										{ name: nextKeyRef.current, key: nextKeyRef.current },
										fields.length
									);
									nextKeyRef.current += 1;
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
				<Input placeholder="Enter instructions" />
			</FormItemWithSublabel>
		</>
	);
};

export default ContainerQs;
