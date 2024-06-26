import { ChallengeFile } from "@/types/ChallengeFile";
import { downloadFile } from "@/util/downloadFile";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useState } from "react";
import Header from "./Header";

interface Props {
	files: ChallengeFile[];
}
const ChallengeFiles = ({ files }: Props) => {
	const [currentFileDownloading, setCurrentFileDownloading] = useState<number | null>(null);

	const handleDownloadClick = async (file: ChallengeFile) => {
		setCurrentFileDownloading(file.id);
		await downloadFile(file.id, file.filename);
		setCurrentFileDownloading(null);
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
					onClick={() => handleDownloadClick(file)}
					loading={currentFileDownloading === file.id}
					type="primary"
					icon={<DownloadOutlined />}
				>
					Download
				</Button>
			),
		},
	];

	return (
		<div>
			<Header>Files</Header>
			<Table
				rowKey={(record) => record.id}
				pagination={false}
				showHeader={false}
				dataSource={files}
				columns={columns}
			/>
		</div>
	);
};

export default ChallengeFiles;
