import { Outlet } from "react-router-dom";

const UserRouteLayout = () => {
	return (
		<div className="p-50px">
			<Outlet />
		</div>
	);
};

export default UserRouteLayout;
