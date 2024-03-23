import { Table, Column, Model, AllowNull, PrimaryKey, DataType, HasMany, AutoIncrement, Scopes, Default } from 'sequelize-typescript';
import { MultipleChoiceOption, ShortAnswerOption, Attempt, PointLog } from '.';

export enum ChallengeType {
	MultipleChoice = "multiple-choice",
	ShortAnswer = "short-answer",
}

export enum PointsType {
	Static = "static",
	Dynamic = "dynamic",
}

@Scopes(() => ({
	withUserAttempts: (userId) => ({
		include: [
			{
				model: Attempt,
				where: { userId: userId },
				required: false
			},
			{
				model: MultipleChoiceOption,
				order: [['order', 'ASC']],
				separate: true,
			},
			ShortAnswerOption,
		]
	}),
	withoutUserAttempts: () => ({
		include: [
			{
				model: MultipleChoiceOption,
				order: [['order', 'ASC']],
				separate: true,
			},
			ShortAnswerOption,
		]
	})
}))
@Table
class Challenge extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id!: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	category!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	title!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	shortDescription!: string;

	@AllowNull(false)
	@Column(DataType.TEXT('medium'))
	description!: string;

	@AllowNull(false)
	@Column(DataType.ENUM(...Object.values(ChallengeType)))
	type!: ChallengeType

	@AllowNull(false)
	@Column(DataType.ENUM(...Object.values(PointsType)))
	pointsType!: PointsType;

	// AKA initialPoints
	@AllowNull(false)
	@Column(DataType.INTEGER)
	points!: number;

	// For dynamic points
	@AllowNull(true)
	@Column(DataType.INTEGER)
	minPoints!: number;

	// For dynamic points
	@AllowNull(true)
	@Column(DataType.INTEGER)
	decay!: number;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	maxAttempts!: number;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	isContainer!: boolean;

	@AllowNull(true)
	@Column(DataType.STRING)
	containerImage!: string;

	@AllowNull(true)
	@Column(DataType.STRING)
	containerInstructions!: string;

	@AllowNull(true)
	@Column(DataType.JSON)
	containerPorts!: number[];

	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER)
	order!: number;

	@Column(DataType.VIRTUAL)
	get isSolved(): boolean {
		if (!this.attempts) {
			return false;
		}
		return this.attempts.some(attempt => attempt.isCorrect);
	}

	@Column(DataType.VIRTUAL)
	get isExhausted(): boolean {
		if (!this.attempts || this.maxAttempts === 0) {
			return false;
		}

		return this.attempts.length >= this.maxAttempts;
	}

	@Column(DataType.VIRTUAL)
	get isSolvedOrExhausted(): boolean {
		return this.isSolved || this.isExhausted;
	}

	@Column(DataType.VIRTUAL)
	get attemptsLeft(): number {
		if (!this.attempts) {
			return 0;
		}

		return this.maxAttempts - this.attempts.length;
	}

	@HasMany(() => MultipleChoiceOption)
	multipleChoiceOptions!: MultipleChoiceOption[];

	@HasMany(() => ShortAnswerOption)
	shortAnswerOptions!: ShortAnswerOption[];

	@HasMany(() => Attempt)
	attempts!: Attempt[];
}

export { Challenge as _Challenge };