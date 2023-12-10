export function requireBody(requirements: string[]) {
	return (req: any, res: any, next: any) => {
		const missing = requirements.filter((requirement) => !req.body[requirement]);

		if (missing.length > 0) {
			return res.status(400).send(`Missing parameters: ${missing.join(", ")}`);
		};

		next();
	}
}