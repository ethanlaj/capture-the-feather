import { Badge } from "@/types/Badge";
import { Button, Modal } from "antd";

interface Props {
	isOpen: boolean;
	badge: Badge;
	handleCancel: () => void;
}

const BadgeModal = ({ badge, isOpen, handleCancel }: Props) => {
	const getEarnersText = () => {
		switch (badge.earners.length) {
			case 0:
				return "No one has earned this badge yet.";
			case 1:
				return `${badge.earners[0]} has earned this badge.`;
			case 2:
				return `${badge.earners[0]} and ${badge.earners[1]} have earned this badge.`;
			case 3:
				return `${badge.earners[0]}, ${badge.earners[1]}, and ${badge.earners[2]} have earned this badge.`;
			default: {
				const joinedEarners = badge.earners.join(", ");
				return `${joinedEarners}, and ${
					badge.earners.length - 3
				} others have earned this badge.`;
			}
		}
	};

	return (
		<Modal
			title={badge.name}
			open={isOpen}
			onCancel={handleCancel}
			footer={[
				<Button key="close" type="primary" onClick={handleCancel}>
					Close
				</Button>,
			]}
		>
			<div className="flex flex-col items-center">
				<img
					src={badge.imageUrl}
					alt={badge.name}
					className="w-32 h-32 object-cover mb-4"
				/>
				<p>{badge.description}</p>
				<p className="my-0">{getEarnersText()}</p>
			</div>
		</Modal>
	);
};

export default BadgeModal;
