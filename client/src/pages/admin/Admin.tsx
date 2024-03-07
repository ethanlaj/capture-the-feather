import { Header } from "antd/es/layout/layout";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
	const location = useLocation();
	const selectedKey = location.pathname;

	const adminNavLinks = {
		"/admin/users": "Users",
		"/admin/challenges": "Challenges",
		"/admin/submissions/all": "Submissions",
		"/admin/settings": "Settings",
	};

	return (
		<div>
			<Header className="bg-gray-800 text-white flex justify-between px-5">
				<div className="flex">
					{Object.entries(adminNavLinks).map(([link, text]) => (
						<Link
							key={link}
							to={link}
							className={`text-gray-400 select-none px-4 inline-block ${
								selectedKey.startsWith(link)
									? "bg-blue-600 text-white pointer-events-none"
									: "hover:text-gray-200"
							}`}
						>
							{text}
						</Link>
					))}
				</div>
			</Header>
			<div className="p-50px">
				<Outlet />
			</div>
		</div>
	);
};

export default AdminLayout;
