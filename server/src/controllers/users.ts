import { Router } from "express";
import { User } from "../database/models";
import { verifyIsAdmin } from "../middleware/verifyIsAdmin";

const router = Router();

router.get("/", verifyIsAdmin, async (_req, res) => {
	const users = await User.findAll({
		attributes: ["id", "email", "name", "totalPoints", "isAdmin", "createdAt", "updatedAt"]
	});

	return res.json(users);
});

export default router;