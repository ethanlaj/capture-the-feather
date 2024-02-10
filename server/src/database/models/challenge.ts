import { Table, Column, Model, AllowNull, PrimaryKey, DataType, HasMany, AutoIncrement, Scopes } from 'sequelize-typescript';
import { MultipleChoiceOption } from './multipleChoiceOption';
import { ShortAnswerOption } from './shortAnswerOption';
import { Attempt } from './attempt';

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
	})
}))
@Table
export class Challenge extends Model {
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
	@Column(DataType.ENUM('multiple-choice', 'short-answer'))
	type!: string;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	points!: number;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	maxAttempts!: number;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	order!: number;

	@Column(DataType.VIRTUAL)
	get isSolved(): boolean {
		return this.attempts.some(attempt => attempt.isCorrect);
	}

	@Column(DataType.VIRTUAL)
	get isExhausted(): boolean {
		return this.attempts.length >= this.maxAttempts;
	}

	@Column(DataType.VIRTUAL)
	get isSolvedOrExhausted(): boolean {
		return this.isSolved || this.isExhausted;
	}

	@Column(DataType.VIRTUAL)
	get attemptsLeft(): number {
		return this.maxAttempts - this.attempts.length;
	}

	@HasMany(() => MultipleChoiceOption)
	multipleChoiceOptions!: MultipleChoiceOption[];

	@HasMany(() => ShortAnswerOption)
	shortAnswerOptions!: ShortAnswerOption[];

	@HasMany(() => Attempt)
	attempts!: Attempt[];
}