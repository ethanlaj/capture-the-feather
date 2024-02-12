import { Line } from "@ant-design/plots";
import { Table } from "antd";
import { useEffect, useState } from "react";

const Leaderboard = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		asyncFetch();
	}, []);

	const asyncFetch = () => {
		fetch("https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json")
			.then((response) => response.json())
			.then((json) => setData(json))
			.catch((error) => {
				console.log("fetch data failed", error);
			});
	};

	const props = {
		data,
		xField: "year",
		yField: "gdp",
		seriesField: "name",
		yAxis: {
			label: {
				formatter: (v: any) => `${(v / 10e8).toFixed(1)} B`,
			},
		},
		legend: {
			position: "bottom",
		},
		smooth: true,
		animation: {
			appear: {
				animation: "path-in",
				duration: 3000,
			},
		},
	};

	const dataSource = [
		{
			key: "1",
			name: "Mike",
			age: 32,
			address: "10 Downing Street",
		},
		{
			key: "2",
			name: "John",
			age: 42,
			address: "10 Downing Street",
		},
	];

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
	];

	return (
		<>
			<h2 className="text-center">Top Ten Users</h2>
			<div className="flex flex-col gap-2">
				<Line {...props} />
				<Table dataSource={dataSource} columns={columns} pagination={false} />
			</div>
		</>
	);
};

export default Leaderboard;
