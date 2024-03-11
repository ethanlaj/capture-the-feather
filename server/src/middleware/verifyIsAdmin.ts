import { Response, NextFunction, Request } from "express";
import { verifyAccess } from "./verifyAccess";

export function verifyIsAdmin(req: Request, res: Response, next: NextFunction) {
	console.log(req)

	if (!req.payload) {
		verifyAccess(req, res, verifyIsAdmin.bind(null, req, res, next));
		return;
	}

	return req.payload.isAdmin ? next() : res.status(403).send("Forbidden");
}