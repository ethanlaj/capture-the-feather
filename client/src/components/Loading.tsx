import { Spin } from "antd";

const Loading = () => {
	return (
		<Spin tip="Loading" size="large">
			<div className="content" />
		</Spin>
	);
};

export default Loading;
