import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Header } = Layout;

const Navbar = () => {
	const location = useLocation();
	const selectedKey = location.pathname;

	return (
		<Header>
			<Menu
				theme="dark"
				mode="horizontal"
				defaultSelectedKeys={[selectedKey]}
				items={[
					{
						key: "/",
						label: <Link to="/">Home</Link>,
					},
					{
						key: "/challenges",
						label: <Link to="/challenges">Challenges</Link>,
					},
				]}
			/>
		</Header>
	);
};

export default Navbar;
