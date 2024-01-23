import { Table, Column, Model, AllowNull, PrimaryKey, DataType, HasMany, AutoIncrement } from 'sequelize-typescript';
import { MultipleChoiceOption } from './multipleChoiceOption';
import { ShortAnswerOption } from './shortAnswerOption';
import { Attempt } from './attempt';

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

	@HasMany(() => MultipleChoiceOption)
	multipleChoiceOptions!: MultipleChoiceOption[];

	@HasMany(() => ShortAnswerOption)
	shortAnswerOptions!: ShortAnswerOption[];

	@HasMany(() => Attempt)
	attempts!: Attempt[];
}