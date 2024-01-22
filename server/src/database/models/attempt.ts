import { Table, Column, Model, AllowNull, PrimaryKey, DataType, ForeignKey, Default, BelongsTo } from 'sequelize-typescript';
import { Challenge } from './challenge';
import { MultipleChoiceOption } from './multipleChoiceOption';
import { User } from './user';

@Table
export class Attempt extends Model {
	@PrimaryKey
	@Column(DataType.UUID)
	id!: string;

	@ForeignKey(() => User)
	@Column(DataType.UUID)
	userId!: string;

	@ForeignKey(() => Challenge)
	@Column(DataType.UUID)
	challengeId!: string;

	@AllowNull(true)
	@Column(DataType.STRING)
	userAnswer!: string;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	isCorrect!: boolean;

	@AllowNull(true)
	@ForeignKey(() => MultipleChoiceOption)
	@Column(DataType.UUID)
	multipleChoiceOptionId!: string;

	@BelongsTo(() => Challenge, { onDelete: 'CASCADE' })
	challenge!: Challenge;
}