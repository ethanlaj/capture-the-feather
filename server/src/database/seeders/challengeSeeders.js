'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		const mcChallengeId = 1;

		await queryInterface.bulkInsert('Challenges', [
			{
				id: mcChallengeId,
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
				id: 2,
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
				id: 1,
				challengeId: mcChallengeId,
				value: "A",
				isCorrect: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 2,
				challengeId: mcChallengeId,
				value: "B",
				isCorrect: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 3,
				challengeId: mcChallengeId,
				value: "C",
				isCorrect: true,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				id: 4,
				challengeId: mcChallengeId,
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
