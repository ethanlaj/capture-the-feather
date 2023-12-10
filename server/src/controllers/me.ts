import { Router } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { User } from "../database/models";
import { requireBody } from "../middleware/requireBody";
import { RefreshToken } from "../database/models/refreshToken";

const router = Router();

router.get("/", (req, res) => {
	// return current user info
});

router.post("/register", requireBody(['email', 'name', 'password']), async (req, res) => {
	const { name, password } = req.body;
	let email = req.body.email.toLowerCase();

	const existingUser = await User.findByPk(email);
	if (existingUser) {
		res.status(400).send("User already exists");
		return;
	}

	const hashedPassword = await hashPassword(password);

	const newUser = await User.create({
		email,
		name,
		passwordHash: hashedPassword,
	});

	res.status(201).json(newUser);
});

router.post("/login", requireBody(['email', 'password']), async (req, res) => {
	const { password } = req.body;
	let email = req.body.email.toLowerCase();

	const user = await User.findByPk(email);
	if (!user) {
		return res.status(401).send("Invalid email or password");
	}

	const valid = bcrypt.compare(password, user.passwordHash);
	if (!valid) {
		return res.status(401).send("Invalid email or password");
	}

	const tokens = await generateTokens(email);
	return res.status(200).json(tokens);
});

router.post("/refresh", requireBody(['token']), async (req, res) => {
	const refreshToken = req.body.token;

	try {
		const payload = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

		const refreshTokenInstance = await RefreshToken.findByPk(payload.id);
		if (!refreshTokenInstance) {
			return res.status(403).send("Invalid refresh token");
		}

		await refreshTokenInstance.destroy();

		const tokens = await generateTokens(payload.email);

		return res.status(200).json(tokens);
	} catch (error) {
		console.error('Error verifying refresh token:', error);
		return res.status(403).send("Invalid refresh token");
	}
});

async function hashPassword(password: string) {
	try {
		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(password, salt);

		return hashedPassword;
	} catch (error) {
		console.error('Error hashing password:', error);
	}
}

async function generateTokens(email: string, isAdmin: boolean = false) {
	const payload = {
		email,
		isAdmin,
	}

	const accessToken = await jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: '1h',
	});

	const refreshTokenId = await RefreshToken.create().then((token) => token.id);

	const refreshToken = await jsonwebtoken.sign(
		{ ...payload, id: refreshTokenId },
		process.env.REFRESH_TOKEN_SECRET!,
		{
			expiresIn: '5d',
		}
	);

	return { accessToken, refreshToken };
}

export default router;