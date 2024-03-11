import { User } from "@/types/User";
import { baseUrl } from ".";
import axios from 'axios';

export class UserService {
	static async getUsers() {
		const response = await axios.get<User[]>(baseUrl + '/users');
		return response.data;
	}
}