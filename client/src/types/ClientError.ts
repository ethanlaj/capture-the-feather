import { notification } from 'antd';

export class ClientError {
	private message: string | null;

	constructor(error: any) {
		if (!error) {
			this.message = null;
			return;
		}

		if (error.response && error.response.data) {
			if (typeof error.response.data === 'string') {
				this.message = error.response.data;
			} else if (error.response.data.error && typeof error.response.data.error === 'string') {
				this.message = error.response.data.error;
			} else if (error.response.data.message && typeof error.response.data.message === 'string') {
				this.message = error.response.data.message;
			} else {
				this.message = "An unexpected error occurred.";
			}
		} else if (error.message) {
			this.message = error.message;
		} else {
			this.message = "An unexpected error occurred.";
		}
	}

	toast() {
		console.log("TOASTING ERROR", this.message)
		if (this.message) {
			notification.error({
				message: this.message,
			});
		}
	}
}