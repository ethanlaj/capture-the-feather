import { Router } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import { User, RefreshToken } from "../database/models";
import { requireBody } from "../middleware/requireBody";
import errorHandler from "../middleware/errorHandler";
import { verifyAccess } from "../middleware/verifyAccess";

const router = Router();

router.get("/", verifyAccess, errorHandler(async (req, res) => {
	const userId = req.payload!.userId;
	const user = User.findByPk(userId, { attributes: ['id', 'email', 'name', 'isAdmin'] });

	return res.json(user);
}));

router.post("/register", requireBody(['email', 'name', 'password']), errorHandler(async (req, res) => {
	const { name, password } = req.body;
	let email = req.body.email.toLowerCase();

	const existingUser = await User.findOne({ where: { email } });
	if (existingUser) {
		res.status(400).send("A user with this email already exists");
		return;
	}

	const hashedPassword = await hashPassword(password);

	const newUser = await User.create({
		email,
		name,
		passwordHash: hashedPassword,
	});

	const tokens = await generateTokens(newUser.id, newUser.isAdmin);
	return res.status(200).json({
		...tokens,
		user: {
			id: newUser.id,
			email: newUser.email,
			name: newUser.name,
			isAdmin: newUser.isAdmin,
		}
	});
}));

router.post("/login", requireBody(['email', 'password']), errorHandler(async (req, res) => {
	const { password } = req.body;
	let email = req.body.email.toLowerCase();

	const user = await User.findOne({ where: { email } });
	if (!user) {
		return res.status(400).send("Invalid email or password");
	}

	const valid = await bcrypt.compare(password, user.passwordHash);
	if (!valid) {
		return res.status(400).send("Invalid email or password");
	}

	const tokens = await generateTokens(user.id, user.isAdmin);
	return res.status(200).json({
		...tokens,
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			isAdmin: user.isAdmin,
		}
	});
}));

router.post("/refresh", errorHandler(async (req, res) => {
	const refreshToken = req.body.token;
	if (!refreshToken) {
		return res.status(403).send("Invalid refresh token");
	}

	try {
		const payload = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

		const refreshTokenInstance = await RefreshToken.findByPk(payload.id);
		if (!refreshTokenInstance) {
			return res.status(403).send("Invalid refresh token");
		}

		await refreshTokenInstance.destroy();

		const tokens = await generateTokens(payload.userId, payload.isAdmin);

		return res.status(200).json(tokens);
	} catch (error) {
		console.error('Error verifying refresh token:', error);
		return res.status(403).send("Invalid refresh token");
	}
}));

async function hashPassword(password: string) {
	try {
		const salt = await bcrypt.genSalt(10);

		const hashedPassword = await bcrypt.hash(password, salt);

		return hashedPassword;
	} catch (error) {
		console.error('Error hashing password:', error);
	}
}

async function generateTokens(userId: number, isAdmin: boolean = false) {
	const payload = {
		userId,
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