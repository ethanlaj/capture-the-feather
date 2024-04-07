import { BadgeService } from "@/services/badgeService";
import { ClientError } from "@/types/ClientError";
import { Alert, Button, Statistic } from "antd";
import { useEffect, useState } from "react";

const Badges = () => {
	const [badgeCount, setBadgeCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchBadges = async () => {
			try {
				setIsLoading(true);
				const response = await BadgeService.getBadges();
				setBadgeCount(response.length);
			} catch (error) {
				console.error(error);
				new ClientError(error).toast();
			} finally {
				setIsLoading(false);
			}
		};

		fetchBadges();
	}, []);

	const handleAutoGenerateClick = async () => {
		try {
			setIsLoading(true);
			const badges = await BadgeService.autoGenerateBadges();
			setBadgeCount(badges.length);
		} catch (error) {
			console.error(error);
			new ClientError(error).toast();
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteClick = async () => {
		try {
			setIsLoading(true);
			await BadgeService.deleteBadges();
			setBadgeCount(0);
		} catch (error) {
			console.error(error);
			new ClientError(error).toast();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<Alert
				description="On this page, badges can be auto-generated. You can only generate badges if there are no existing badges."
				type="info"
				showIcon
			/>
			<Statistic
				className="text-center"
				title="Badges"
				loading={isLoading}
				value={badgeCount}
			/>
			<div className="flex gap-2 w-full">
				<Button
					onClick={handleAutoGenerateClick}
					className="w-full"
					type="primary"
					disabled={badgeCount > 0}
				>
					Auto-Generate Badges
				</Button>
				<Button
					onClick={handleDeleteClick}
					className="w-full"
					type="primary"
					danger
					disabled={badgeCount === 0}
				>
					Delete All Badges
				</Button>
			</div>
		</div>
	);
};

export default Badges;
