import dotenv from "dotenv";
dotenv.config();
import { load } from "./loaders";
import app from './app';

const port = process.env.PORT || 3001;

load();

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});