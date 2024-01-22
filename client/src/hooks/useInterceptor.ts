import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { UserService } from '@/services/userService';
import { ClientError } from '@/types/ClientError';
import { useUser } from '@/contexts/UserContext';

const urlsToAddAuth = [
	'http://localhost:3001',
];

const useInterceptor = () => {
	const navigate = useNavigate();
	const { user, setUser } = useUser();

	function setInterceptors() {
		axios.interceptors.request.clear();
		axios.interceptors.request.use(async (config) => {
			if (!urlsToAddAuth.some((url) => config.url && config.url.startsWith(url))) return config;

			const token = await localStorage.getItem('accessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		axios.interceptors.response.clear();
		axios.interceptors.response.use(null, async (error) => {
			const originalRequest = error.config;

			// Check if the error was a 401 and the request wasn't a retry
			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				if (!user) {
					navigate('/login');
					return Promise.reject(null); // Throw null - we don't want to show an error message
				}

				// No new token, attempt to get a new one
				try {
					const response = await UserService.getNewTokens();

					if (response.accessToken) {
						UserService.setAccessToken(response.accessToken);
						UserService.setRefreshToken(response.refreshToken);

						originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
						return axios(originalRequest);
					}
				} catch (error) {
					new ClientError(new Error("Session expired, please login again")).toast();
					UserService.logout();
					setUser(null);

					navigate('/login');
					return Promise.reject(null); // Throw null - we don't want to show an error message
				}
			}

			if (error.response?.status === 403) {
				navigate('/unauthorized');
				return Promise.reject(error);
			}

			const expectedError = error.response
				&& error.response.status >= 400
				&& error.response.status < 500;

			if (!expectedError) {
				notification.error({
					message: 'Unexpected error',
					description: 'An unexpected error occurred. Please try again later.',
				});
			}

			return Promise.reject(error);
		});
	}

	return setInterceptors;
};

export default useInterceptor;