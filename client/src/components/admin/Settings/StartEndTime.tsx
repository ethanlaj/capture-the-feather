import React, { useEffect } from "react";
import { Button, DatePicker, Form } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ConfigurationService } from "@/services/configurationService";
import { ClientError } from "@/types/ClientError";
import { ClientSuccess } from "@/types/ClientSuccess";

const StartEndTime: React.FC = () => {
	const [form] = Form.useForm();

	useEffect(() => {
		async function fetchConfiguration() {
			const configuration = await ConfigurationService.getConfiguration();
			form.setFieldsValue({
				startTime: dayjs(configuration.startTime),
				endTime: dayjs(configuration.endTime),
			});
		}

		fetchConfiguration();
	}, [form]);

	const validateEndDate = (_: any, value: Dayjs) => {
		const startTime = form.getFieldValue("startTime");
		if (startTime && value && value.isBefore(startTime)) {
			return Promise.reject(new Error("End time must be after start time"));
		}
		return Promise.resolve();
	};

	const onFinish = async (values: any) => {
		try {
			await ConfigurationService.updateConfiguration(values);
			ClientSuccess.toast("Configuration updated successfully");
		} catch (error) {
			new ClientError(error).toast();
		}
	};

	return (
		<Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 600 }}>
			<Form.Item label="Start Time" name="startTime" rules={[{ required: true }]}>
				<DatePicker showTime use12Hours format="M/D/YYYY h:mm:ss A" />
			</Form.Item>

			<Form.Item
				label="End Time"
				name="endTime"
				rules={[{ required: true }, { validator: validateEndDate }]}
			>
				<DatePicker showTime use12Hours format="M/D/YYYY h:mm:ss A" />
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
};

export default StartEndTime;
