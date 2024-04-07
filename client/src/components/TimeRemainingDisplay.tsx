import { useCallback, useEffect, useState } from "react";
import { Statistic } from "antd";
import { formatDuration, intervalToDuration } from "date-fns";
import { ConfigurationService } from "@/services/configurationService";
import { Configuration } from "@/types/Configuration";

const TimeRemainingDisplay = () => {
	const [configuration, setConfiguration] = useState<Configuration | null>(null);
	const [countdownStatus, setCountdownStatus] = useState<"pre" | "mid" | "post" | null>(null);
	const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

	useEffect(() => {
		async function getConfiguration() {
			const result = await ConfigurationService.getConfiguration();
			if (result.startTime && result.endTime) {
				setConfiguration(result);
				updateCountdownStatus(result);
			}
		}

		getConfiguration();

		const intervalId = setInterval(() => {
			getConfiguration();
		}, 15000);

		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateCountdownStatus = useCallback(
		(config?: Configuration) => {
			const configToUse = config || configuration;
			if (!configToUse) return;

			const now = new Date();
			const startTime = new Date(configToUse.startTime);
			const endTime = new Date(configToUse.endTime);

			if (now < startTime) {
				setCountdownStatus("pre");
			} else if (now >= startTime && now <= endTime) {
				setCountdownStatus("mid");
			} else if (now > endTime) {
				setCountdownStatus("post");
			}
		},
		[configuration]
	);

	const updateTimeRemaining = useCallback(() => {
		if (!configuration) return;

		updateCountdownStatus();

		const now = new Date();
		const targetTime =
			countdownStatus === "pre"
				? new Date(configuration.startTime)
				: new Date(configuration.endTime);

		const duration = intervalToDuration({ start: now, end: targetTime });
		const formattedDuration = formatDuration(duration);
		setTimeRemaining(formattedDuration);
	}, [configuration, countdownStatus, updateCountdownStatus]);

	useEffect(() => {
		const interval = setInterval(() => {
			updateTimeRemaining();
		}, 1000);

		return () => clearInterval(interval);
	}, [updateTimeRemaining]);

	if (!configuration) return null;

	return (
		<div className="w-100 text-center bg-gray-200">
			{countdownStatus === "post" ? (
				<div className="font-bold p-5">Game is over!</div>
			) : (
				<Statistic
					className="p-3"
					title={countdownStatus === "pre" ? "Game Starts In:" : "Game Ends In:"}
					value={timeRemaining || "Loading..."}
				/>
			)}
		</div>
	);
};

export default TimeRemainingDisplay;
