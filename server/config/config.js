require("dotenv").config();

module.exports = {
	"development": {
		"use_env_variable": "CTF_DB_URL",
		"dialect": "mysql"
	},
	"production": {
		"use_env_variable": "CTF_DB_URL",
		"dialect": "mysql"
	}
}
