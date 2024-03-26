import Dragger from "antd/es/upload/Dragger";
import FormItem from "antd/es/form/FormItem";
import { InboxOutlined } from "@ant-design/icons";
import { UploadProps } from "antd";

const ChallengeFiles = () => {
	const props: UploadProps = {
		beforeUpload: () => {
			return false;
		},
	};

	const normFile = (e: any) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	return (
		<FormItem
			name="newFiles"
			label="Challenge Files"
			valuePropName="fileList"
			getValueFromEvent={normFile}
		>
			<Dragger {...props} style={{ backgroundColor: "white" }}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">Click or drag files to this area to upload</p>
				<p className="ant-upload-hint">
					Files uploaded here will be available to participants for download.
				</p>
			</Dragger>
		</FormItem>
	);
};

export default ChallengeFiles;
