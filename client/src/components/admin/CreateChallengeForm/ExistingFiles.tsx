import { ChallengeFile } from "@/types/ChallengeFile";
import { Table } from "antd";
import ChallengeFileActions from "./ChallengeFileActions";

interface Props {
	existingFiles: ChallengeFile[];
	filesToDelete: number[];
	setFilesToDelete: (files: number[]) => void;
}

const ExistingFiles = ({ existingFiles, filesToDelete, setFilesToDelete }: Props) => {
	const columns = [
		{
			title: "Name",
			dataIndex: "filename",
			key: "filename",
		},
		{
			key: "action",
			render: (file: ChallengeFile) => (
				<ChallengeFileActions
					file={file}
					isMarkedForDeletion={filesToDelete.includes(file.id)}
					handleDelete={() => setFilesToDelete([...filesToDelete, file.id])}
					handleUnmarkForDeletion={() =>
						setFilesToDelete(filesToDelete.filter((id) => id !== file.id))
					}
				/>
			),
		},
	];

	return (
		<Table
			rowKey={(record) => record.id}
			pagination={false}
			dataSource={existingFiles}
			rowClassName={(record) =>
				filesToDelete.includes(record.id) ? "marked-for-deletion" : ""
			}
			columns={columns}
		/>
	);
};

export default ExistingFiles;
