# How to Import Challenges

This project is used to import challenges from .yml files into the database. The .yml files should be in the same format as the ones in the `supported` directory.

A good example of where to find such challenges is [here](https://github.com/csivitu/ctf-challenges/tree/master). Dockerfile challenges are not supported at this time.

1. Copy the `.env.example` file in the root directory to a new file called `.env`
1. Fill in the `.env` file with the appropriate values.
1. Run `npm install` in the root directory.
1. Copy the challenges you want to import into a new folder in the `importer` project. The import script will look for all files named 'challenge.yml' and attempt to import them.
1. Run `npm run import` in the root directory. Follow the prompts to import the challenges.