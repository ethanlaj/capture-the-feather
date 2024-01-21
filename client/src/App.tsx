import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChallengesView from "./pages/ChallengesView";
import Home from "./pages/Home";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import useInterceptor from "./hooks/useInterceptor";
import Loading from "./components/Loading";

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
			<Content className="p-50px">
				<Routes>
					<Route path={"/"} element={<Home />} />
					<Route path={"/challenges"} element={<ChallengesView />} />
					<Route path={"/login"} element={<Login />} />
					<Route path={"/register"} element={<Register />} />
				</Routes>
			</Content>
		</Layout>
	);
};

export default App;
