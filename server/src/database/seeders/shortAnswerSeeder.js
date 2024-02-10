'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		const shortAnswerChallengeId = 2;

		await queryInterface.bulkInsert('ShortAnswerOptions', [
			{
				id: 1,
				challengeId: shortAnswerChallengeId,
				value: "A",
				matchMode: 'static',
				isCaseSensitive: false,
				createdAt: new Date(),
				updatedAt: new Date()
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('ShortAnswerOptions', null, {});
	}
};
