import { useUser } from "@/contexts/UserContext";
import { MeService } from "@/services/meService";
import { Button, Layout } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TimeRemainingDisplay from "./TimeRemainingDisplay";
const { Header } = Layout;

const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, setUser } = useUser();
	const selectedKey = location.pathname;

	const navBarLinks = {
		"/": "Home",
		"/challenges": "Challenges",
		"/leaderboard": "Leaderboard",
		"/badges": "Badges",
		...(user && user.isAdmin ? { "/admin": "Admin" } : {}),
	};

	const isLoggedIn = user != null;

	const logout = () => {
		MeService.logout();
		setUser(null);
		navigate("/");
	};

	const isOnAdminRoute = location.pathname.includes("/admin");

	return (
		<>
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
							<div className="text-gray-200">Welcome, {user.name}!</div>
							<Button danger className="bg-transparent" onClick={() => logout()}>
								Logout
							</Button>
						</div>
					)}
				</div>
			</Header>
			{!isOnAdminRoute && <TimeRemainingDisplay />}
		</>
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
				isActive ? "bg-blue-600 text-white pointer-events-none" : "hover:text-gray-200"
			}`}
			to={to}
		>
			{children}
		</Link>
	);
};
