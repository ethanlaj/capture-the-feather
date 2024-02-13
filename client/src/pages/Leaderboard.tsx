import { LeaderboardService } from "@/services/leaderboardService";
import { LeaderboardData } from "@/types/LeaderboardData";
import { Line } from "@ant-design/plots";
import { Table } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const Leaderboard = () => {
	const [data, setData] = useState<LeaderboardData>({
		chartData: [],
		tableData: [],
	});

	useEffect(() => {
		const getLeaderboardData = async () => {
			const response = await LeaderboardService.getLeaderboardData();

			const newTableData = response.tableData.map((data, index) => {
				return {
					place: index + 1,
					key: data.id,
					...data,
				};
			});

			setData({
				chartData: response.chartData,
				tableData: newTableData,
			});
		};

		getLeaderboardData();
	}, []);

	const formatDate = (timestamp: string) => {
		return format(new Date(parseInt(timestamp)), "MM/dd 'at' hh:mm:ss aa");
	};

	const props = {
		data: data.chartData,
		xField: "timestamp",
		yField: "cumulativePoints",
		seriesField: "name",
		tooltip: {
			title: formatDate,
		},
		xAxis: {
			label: {
				formatter: formatDate,
			},
		},
		yAxis: {
			label: {
				formatter: (cumulativePoints: number) => `${cumulativePoints} points`,
			},
			title: {
				text: "Cumulative Points",
				style: {
					fontSize: 16,
				},
			},
		},
		legend: {
			position: "bottom",
		},
		animation: {
			appear: {
				animation: "path-in",
				duration: 3000,
			},
		},
	};

	const columns = [
		{
			title: "Place",
			dataIndex: "place",
			key: "place",
		},
		{
			title: "User",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Total Points",
			dataIndex: "totalPoints",
			key: "totalPoints",
		},
	];

	return (
		<>
			<h2 className="text-center">Top Ten Users</h2>
			<div className="flex flex-col gap-2">
				<Line {...props} />
				<Table dataSource={data.tableData} columns={columns} pagination={false} />
			</div>
		</>
	);
};

export default Leaderboard;
