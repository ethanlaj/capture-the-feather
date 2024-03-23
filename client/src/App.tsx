import { Layout } from "antd";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChallengesView from "./pages/ChallengesView";
import Home from "./pages/Home";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import useInterceptor from "./hooks/useInterceptor";
import Loading from "./components/Loading";
import Leaderboard from "./pages/Leaderboard";
import Badges from "./pages/Badges";
import AdminLayout from "./pages/admin/Admin";
import UserRouteLayout from "./components/UserRouteLayout";
import Challenges from "./pages/admin/Challenges";
import Users from "./pages/admin/Users";
import CreateChallenge from "./pages/admin/CreateChallenge";

const { Content } = Layout;

const App = () => {
	const [isLoading, setIsLoading] = useState(true);
	const setInterceptors = useInterceptor();

	useEffect(() => {
		setInterceptors();
		setIsLoading(false);
	}, [setInterceptors]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<Layout className="flex flex-col min-h-screen">
			<Navbar />
			<Content>
				<Routes>
					<Route element={<UserRouteLayout />}>
						<Route path={"/"} element={<Home />} />
						<Route path={"/challenges"} element={<ChallengesView />} />
						<Route path={"/login"} element={<Login />} />
						<Route path={"/register"} element={<Register />} />
						<Route path={"/leaderboard"} element={<Leaderboard />} />
						<Route path={"/badges"} element={<Badges />} />
					</Route>
					<Route path="/admin" element={<AdminLayout />}>
						<Route index element={<Navigate replace to="users" />} />
						<Route path="users" element={<Users />} />
						<Route path="challenges" element={<Challenges />} />
						<Route path="challenges/create" element={<CreateChallenge />} />
						<Route path="challenges/edit/:id" element={<CreateChallenge />} />
						<Route
							path="attempts/*"
							element={
								<>
									<div>Attempts</div>
									<Outlet />
								</>
							}
						>
							<Route path="all" element={<div>All Attempts</div>} />
							<Route path="manual" element={<div>Manual Review</div>} />
							<Route path="correct" element={<div>Correct Attempts</div>} />
							<Route path="incorrect" element={<div>Incorrect Attempts</div>} />
						</Route>
						<Route path="settings" element={<div>Settings</div>} />
					</Route>
				</Routes>
			</Content>
		</Layout>
	);
};

export default App;
