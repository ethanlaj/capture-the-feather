import { formatDuration, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
	expiresAt: string;
}

const ChallengeExpiresIn = ({ expiresAt }: Props) => {
	const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

	useEffect(() => {
		const getAndSetTimeRemaining = () => {
			const time = formatTime();
			setTimeRemaining(time);
		};

		const formatTime = () => {
			const duration = intervalToDuration({
				start: new Date(),
				end: new Date(expiresAt),
			});

			return formatDuration(duration);
		};

		getAndSetTimeRemaining();
		const interval = setInterval(getAndSetTimeRemaining, 1000);
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [expiresAt]);

	return <div>{timeRemaining}</div>;
};

export default ChallengeExpiresIn;
