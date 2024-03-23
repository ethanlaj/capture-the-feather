import { Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Challenge } from "@/types/Challenge";
import { useNavigate } from "react-router-dom";

const { error } = Modal;

interface Props {
	challenge: Challenge;
	handleDelete: (id: number) => void;
}

const ChallengeActions = ({ challenge, handleDelete }: Props) => {
	const navigate = useNavigate();

	const showDeleteConfirm = () => {
		error({
			title: `Are you sure delete challenge "${challenge.title}"?`,
			icon: <ExclamationCircleOutlined />,
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
			<Button
				icon={
					<EditOutlined
						onClick={() => navigate(`/admin/challenges/edit/${challenge.id}`)}
					/>
				}
			/>
			<Button danger icon={<DeleteOutlined />} onClick={showDeleteConfirm} />
		</div>
	);
};

export default ChallengeActions;
