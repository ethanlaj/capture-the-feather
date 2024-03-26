import { Button } from "antd";
import { DownloadOutlined, DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import { ChallengeFile } from "@/types/ChallengeFile";
import { downloadFile } from "@/util/downloadFile";
import { useState } from "react";

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
	const [isDownloading, setIsDownloading] = useState<boolean>(false);

	const handleDownloadClick = async () => {
		setIsDownloading(true);
		await downloadFile(file.id, file.filename);
		setIsDownloading(false);
	};

	return (
		<div className="flex justify-center gap-1">
			<Button
				onClick={() => handleDownloadClick()}
				loading={isDownloading}
				icon={<DownloadOutlined />}
			/>
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
