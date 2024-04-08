import { ImportExportService } from "@/services/importExportService";
import { ClientError } from "@/types/ClientError";
import { ClientSuccess } from "@/types/ClientSuccess";
import { InboxOutlined } from "@ant-design/icons";
import { Alert, Button, Form, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";

const Import = () => {
	const [isImporting, setIsImporting] = useState<boolean>(false);

	const props: UploadProps = {
		beforeUpload: () => {
			return false;
		},
		maxCount: 1,
	};

	const handleSubmit = async (values: any) => {
		try {
			setIsImporting(true);

			await ImportExportService.import(values.file[0].originFileObj);

			ClientSuccess.toast("Imported successfully");
		} catch (error) {
			console.error(error);
			new ClientError(error).toast();
		} finally {
			setIsImporting(false);
		}
	};

	const normFile = (e: any) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const [form] = Form.useForm();

	return (
		<div className="flex flex-col gap-3">
			<Alert
				description="Import challenge data from a ZIP file provided by the export section."
				type="info"
				showIcon
			/>
			<Form form={form} onFinish={handleSubmit}>
				<Form.Item name="file" getValueFromEvent={normFile} valuePropName="fileList">
					<Dragger {...props} className="w-full">
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Click or drag file to this area to upload</p>
					</Dragger>
				</Form.Item>

				<Form.Item>
					<Button loading={isImporting} type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Import;
