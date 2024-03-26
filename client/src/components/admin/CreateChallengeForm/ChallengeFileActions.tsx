import { Button } from "antd";
import { DownloadOutlined, DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import { ChallengeFile } from "@/types/ChallengeFile";

interface Props {
	file: ChallengeFile;
	isMarkedForDeletion: boolean;
	handleUnmarkForDeletion: (id: number) => void;
	handleDelete: (id: number) => void;
}

const ChallengeFileActions = ({
	file,
	isMarkedForDeletion,
	handleDelete,
	handleUnmarkForDeletion,
}: Props) => {
	const downloadFile = () => {
		console.log("Download file");
	};

	return (
		<div className="flex justify-center gap-1">
			<Button onClick={downloadFile} icon={<DownloadOutlined />} />
			<Button
				danger={!isMarkedForDeletion}
				icon={isMarkedForDeletion ? <UndoOutlined /> : <DeleteOutlined />}
				onClick={() =>
					isMarkedForDeletion ? handleUnmarkForDeletion(file.id) : handleDelete(file.id)
				}
			/>
		</div>
	);
};

export default ChallengeFileActions;
