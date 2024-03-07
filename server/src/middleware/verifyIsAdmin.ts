import { Response, NextFunction, Request } from "express";

export function verifyIsAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.payload)
		throw new Error("This middleware should be used after verifyAccess middleware");

	return req.payload.isAdmin ? next() : res.status(403).send("Forbidden");
}