import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		const convertedFilename = Buffer.from(file.originalname, "latin1").toString("utf8");
		file.originalname = convertedFilename;
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

export const upload = multer({ storage: storage });