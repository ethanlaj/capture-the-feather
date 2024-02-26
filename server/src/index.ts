import dotenv from "dotenv";
dotenv.config();
import { load } from "./loaders";
import app from './app';
import express from "express";
import path from "path";

const port = process.env.PORT || 3001;

load();

app.use(express.static(path.join(__dirname, 'static')));

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});