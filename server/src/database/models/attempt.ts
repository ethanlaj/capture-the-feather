import { Table, Column, Model, AllowNull, PrimaryKey, DataType, ForeignKey, Default, BelongsTo, AutoIncrement } from 'sequelize-typescript';
import { Challenge } from './challenge';
import { MultipleChoiceOption } from './multipleChoiceOption';
import { User } from './user';

@Table
export class Attempt extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id!: number;

	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	userId!: number;

	@ForeignKey(() => Challenge)
	@Column(DataType.INTEGER)
	challengeId!: number;

	@AllowNull(true)
	@Column(DataType.STRING)
	userAnswer!: string;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	isCorrect!: boolean;

	@AllowNull(true)
	@ForeignKey(() => MultipleChoiceOption)
	@Column(DataType.INTEGER)
	multipleChoiceOptionId!: number;

	@BelongsTo(() => Challenge, { onDelete: 'CASCADE' })
	challenge!: Challenge;
}