import { notification } from 'antd';

export class ClientError {
	private message: string | null;

	constructor(error: any) {
		if (!error) {
			this.message = null;
			return;
		}

		if (error.response && error.response.data && typeof error.response.data === 'string') {
			this.message = error.response.data;
		} else if (error.message) {
			this.message = error.message;
		} else {
			this.message = "An unexpected error occurred.";
		}
	}

	toast() {
		if (this.message) {
			notification.error({
				message: this.message,
			});
		}
	}
}