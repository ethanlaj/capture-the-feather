import { Table, Column, Model, AllowNull, PrimaryKey, DataType, BelongsTo, ForeignKey, AutoIncrement } from 'sequelize-typescript';
import { Challenge } from './challenge';

@Table
export class MultipleChoiceOption extends Model {
	@PrimaryKey
	@AutoIncrement
	@AllowNull(false)
	@Column(DataType.INTEGER)
	id!: number;

	@ForeignKey(() => Challenge)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	challengeId!: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	value!: string;

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	isCorrect!: boolean;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	order!: number;

	@BelongsTo(() => Challenge, { onDelete: 'CASCADE' })
	challenge!: Challenge;
}