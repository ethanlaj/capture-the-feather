import { notification } from 'antd';

export class ClientSuccess {
	static toast(message: string) {
		notification.success({
			message: message,
		});
	}
}