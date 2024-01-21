'use strict';
const { v4: uuidv4 } = require("uuid")

module.exports = {
	async up(queryInterface, Sequelize) {
		const mcUuid = uuidv4();

		await queryInterface.bulkInsert('Challenges', [
			{
				id: mcUuid,
				category: 'Mathematics',
				title: 'Basic Algebra',
				shortDescription: 'Solve linear equations',
				description: 'description',
				type: 'multiple-choice',
				points: 10,
				maxAttempts: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: uuidv4(),
				category: 'Science',
				title: 'Chemical Elements',
				shortDescription: 'Identify elements from the periodic table',
				description: 'description',
				type: 'short-answer',
				points: 15,
				maxAttempts: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {});

		await queryInterface.bulkInsert('MultipleChoiceOptions', [
			{
				id: uuidv4(),
				challengeId: mcUuid,
				value: "A",
				isCorrect: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: uuidv4(),
				challengeId: mcUuid,
				value: "B",
				isCorrect: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: uuidv4(),
				challengeId: mcUuid,
				value: "C",
				isCorrect: true,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: uuidv4(),
				challengeId: mcUuid,
				value: "D",
				isCorrect: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Challenges', null, {});
		await queryInterface.bulkDelete('MultipleChoiceOptions', null, {});
	}
};
