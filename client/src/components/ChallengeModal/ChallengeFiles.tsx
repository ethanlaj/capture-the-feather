import { ChallengeFile } from "@/types/ChallengeFile";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";

interface Props {
	files: ChallengeFile[];
}
const ChallengeFiles = ({ files }: Props) => {
	const downloadFile = (file: ChallengeFile) => {
		console.log(file);
	};

	const columns = [
		{
			dataIndex: "filename",
			key: "filename",
		},
		{
			key: "action",
			render: (file: ChallengeFile) => (
				<Button
					onClick={() => downloadFile(file)}
					type="primary"
					icon={<DownloadOutlined />}
				>
					Download
				</Button>
			),
		},
	];

	return (
		<Table
			rowKey={(record) => record.id}
			pagination={false}
			showHeader={false}
			dataSource={files}
			title={() => <div className="font-bold text-center">Challenge Files</div>}
			columns={columns}
		/>
	);
};

export default ChallengeFiles;
