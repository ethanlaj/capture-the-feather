import { useState, useEffect } from "react";
import { Table } from "antd";
import { User } from "@/types/User";
import { UserService } from "@/services/userService";
import { ColumnsType } from "antd/es/table";
import { FaCheck } from "react-icons/fa";

const Users = () => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		async function getUsers() {
			const data = await UserService.getUsers();
			setUsers(data);
		}

		getUsers();
	}, []);

	const columns: ColumnsType<User> = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Admin",
			dataIndex: "isAdmin",
			key: "isAdmin",
			render: (isAdmin: boolean) => {
				if (isAdmin) {
					return <FaCheck />;
				}
			},
		},
	];

	return (
		<Table
			title={() => <h1 className="text-center">Users</h1>}
			bordered
			pagination={false}
			dataSource={users}
			columns={columns}
			rowKey="id"
		/>
	);
};

export default Users;
