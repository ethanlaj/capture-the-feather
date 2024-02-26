import { useState, useEffect } from "react";
import { Card } from "antd";
import { BadgeService } from "@/services/badgeService";
import { Badge } from "@/types/Badge";
import BadgeModal from "@/components/BadgeModal";

const Badges = () => {
	const [badges, setBadges] = useState<Badge[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

	useEffect(() => {
		const fetchBadges = async () => {
			const response = await BadgeService.getBadges();
			setBadges(response);
		};

		fetchBadges();
	}, []);

	const showModal = (badge: Badge) => {
		setSelectedBadge(badge);
		setIsOpen(true);
	};

	const handleCancel = () => {
		setIsOpen(false);
	};

	const getCardClasses = (badge: Badge) => {
		let classes = "cursor-pointer rounded-lg overflow-hidden shadow-lg";

		if (badge.isAwarded === true) {
			classes += " bg-green-200";
		}

		return classes;
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{badges.map((badge) => (
					<Card
						key={badge.id}
						hoverable
						className={getCardClasses(badge)}
						onClick={() => showModal(badge)}
					>
						<div className="flex flex-col items-center w-50 h-50">
							<img
								src={badge.imageUrl}
								alt={badge.name}
								className="w-24 h-24 object-cover"
							/>{" "}
							{/* Ensure images are square */}
							<h3 className="text-lg font-semibold mt-2">{badge.name}</h3>
						</div>
					</Card>
				))}
			</div>
			{selectedBadge && (
				<BadgeModal isOpen={isOpen} badge={selectedBadge} handleCancel={handleCancel} />
			)}
		</>
	);
};

export default Badges;
