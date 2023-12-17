import { Button } from "antd";

const Home = () => {
	return (
		<div className="bg-gray-100 flex flex-col items-center justify-center">
			<img src="/ctf-logo.png" alt="CTF Logo" className="mb-8 max-w-sm" />

			<div className="text-center">
				<h1 className="text-4xl text-blue-500 font-bold mb-4">
					Welcome to Capture the Feather
				</h1>
				<p className="text-lg text-gray-700 mb-6">
					Engage in exciting capture the flag challenges and enhance your cybersecurity
					skills.
				</p>

				<Button type="primary" size="large">
					Start a Challenge
				</Button>
			</div>
		</div>
	);
};

export default Home;
