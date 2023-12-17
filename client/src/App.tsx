import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ChallengesView from "./pages/ChallengesView";
import Home from "./pages/Home";
import "./App.css";

const { Content } = Layout;

const App = () => {
	return (
		<Router>
			<Layout className="flex flex-col min-h-screen">
				<Navbar />
				<Content className="p-50px">
					<Routes>
						<Route path={"/"} element={<Home />} />
						<Route path={"/challenges"} element={<ChallengesView />} />
					</Routes>
				</Content>
			</Layout>
		</Router>
	);
};

export default App;
