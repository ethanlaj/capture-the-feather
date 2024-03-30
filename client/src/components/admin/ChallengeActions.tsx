import { Button, Modal, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Challenge } from "@/types/Challenge";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

interface Props {
	challenge: Challenge;
	handleDelete: (id: number) => void;
}

const ChallengeActions = ({ challenge, handleDelete }: Props) => {
	const navigate = useNavigate();

	const showDeleteConfirm = () => {
		confirm({
			title: `Are you sure delete challenge "${challenge.title}"?`,
			icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
			content: "This action cannot be undone",
			okText: "Yes, delete it",
			okType: "danger",
			cancelText: "No",
			width: 600,
			onOk() {
				handleDelete(challenge.id);
			},
			onCancel() {
				console.log("Deletion cancelled");
			},
		});
	};

	return (
		<div className="flex justify-center gap-1">
			<Tooltip title="Edit Challenge">
				<Button
					onClick={() => navigate(`/admin/challenges/edit/${challenge.id}`)}
					icon={<EditOutlined />}
				/>
			</Tooltip>
			<Tooltip title="Delete Challenge">
				<Button danger icon={<DeleteOutlined />} onClick={showDeleteConfirm} />
			</Tooltip>
		</div>
	);
};

export default ChallengeActions;
