import { Response, NextFunction, Request } from "express";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

export function verifyAccess(req: Request, res: Response, next: NextFunction) {
	const authorization = req.headers.authorization;
	if (!authorization) {
		return res.status(401).send("Unauthorized");
	}

	const token = authorization.split(" ")[1];
	if (!token) {
		return res.status(401).send("Unauthorized");
	}

	jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, payload) => {
		if (err) {
			return res.status(401).send("Unauthorized");
		}

		req.payload = payload as JwtPayload;

		if (!req.payload?.userId) {
			return res.status(401).send("Unauthorized");
		}

		next();
	});

}