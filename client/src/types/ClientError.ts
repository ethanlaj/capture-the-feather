import { notification } from 'antd';

export class ClientError {
	private message: string;

	constructor(error: any) {
		if (error.response && error.response.data && typeof error.response.data === 'string') {
			this.message = error.response.data;
		} else if (error.message) {
			this.message = error.message;
		} else {
			this.message = "An unexpected error occurred.";
		}
	}

	toast() {
		notification.error({
			message: this.message,
		});
	}
}