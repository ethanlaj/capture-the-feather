import { LeaderboardService } from "@/services/leaderboardService";
import { Line, LineConfig } from "@ant-design/plots";
import { Table } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface UpdatedLeaderboardData {
	chartData: {
		key: number;
		name: string;
		timestamp: string;
		cumulativePoints: number;
	}[];
	tableData: {
		id: number;
		name: string;
		totalPoints: number;
	}[];
}

const Leaderboard = () => {
	const [data, setData] = useState<UpdatedLeaderboardData>({
		chartData: [],
		tableData: [],
	});

	const formatDate = (timestamp: number) => {
		return format(new Date(timestamp), "M/d 'at' h:mm aa");
	};

	useEffect(() => {
		const getLeaderboardData = async () => {
			const response = await LeaderboardService.getLeaderboardData();

			const newChartData = response.chartData.map((data) => {
				return {
					...data,
					timestamp: formatDate(data.timestamp),
				};
			});

			const newTableData = response.tableData.map((data, index) => {
				return {
					place: index + 1,
					key: data.id,
					...data,
				};
			});

			setData({
				chartData: newChartData,
				tableData: newTableData,
			});
		};

		getLeaderboardData();
	}, []);

	const props: LineConfig = {
		data: data.chartData,
		xField: "timestamp",
		yField: "cumulativePoints",
		seriesField: "name",
		slider: {
			start: 0,
			end: 1,
		},
		yAxis: {
			label: {
				formatter: (cumulativePoints: string) => `${cumulativePoints} points`,
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
