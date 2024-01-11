import { Button, Layout } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Header } = Layout;

const Navbar = () => {
	const location = useLocation();
	const selectedKey = location.pathname;

	const isLoggedIn = false;

	const navBarLinks = {
		"/home": "Home",
		"/challenges": "Challenges",
	};

	return (
		<Header className="flex justify-between px-5">
			<div className="flex">
				{Object.entries(navBarLinks).map(([link, text]) => (
					<NavBarLink key={link} to={link} isActive={selectedKey === link}>
						{text}
					</NavBarLink>
				))}
			</div>
			<div className="flex align-middle gap-4">
				{!isLoggedIn ? (
					<div className="flex">
						<NavBarLink
							key={"/login"}
							to={"/login"}
							isActive={selectedKey === "/login"}
						>
							Login
						</NavBarLink>
						<NavBarLink
							key={"/register"}
							to={"/register"}
							isActive={selectedKey === "/register"}
						>
							Register
						</NavBarLink>
					</div>
				) : (
					<div className="flex gap-4 items-center">
						<div className="text-gray-200">Welcome, User!</div>
						<Button danger className="bg-transparent">
							Logout
						</Button>
					</div>
				)}
			</div>
		</Header>
	);
};

export default Navbar;

interface NavBarLinkProps {
	to: string;
	isActive?: boolean;
	children: React.ReactNode;
}

const NavBarLink = ({ to, children, isActive }: NavBarLinkProps) => {
	return (
		<Link
			className={`text-gray-400 select-none px-4 inline-block ${
				isActive ? "bg-blue-600 text-gray-100 pointer-events-none" : "hover:text-gray-200"
			}`}
			to={to}
		>
			{children}
		</Link>
	);
};
