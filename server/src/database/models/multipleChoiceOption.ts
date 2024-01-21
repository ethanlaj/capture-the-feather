import { Table, Column, Model, AllowNull, PrimaryKey, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Challenge } from './challenge';

@Table
export class MultipleChoiceOption extends Model {
	@PrimaryKey
	@AllowNull(false)
	@Column(DataType.UUID)
	id!: string;

	@ForeignKey(() => Challenge)
	@AllowNull(false)
	@Column(DataType.UUID)
	challengeId!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	value!: string;

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	isCorrect!: boolean;

	@BelongsTo(() => Challenge, { onDelete: 'CASCADE' })
	challenge!: Challenge;
}