import { Table, Column, Model, AllowNull, PrimaryKey, DataType, BelongsTo, ForeignKey, AutoIncrement, Default } from 'sequelize-typescript';
import { Challenge } from '.';

@Table
class MultipleChoiceOption extends Model {
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

	@AllowNull(true)
	@Default(0)
	@Column(DataType.INTEGER)
	order!: number;

	@BelongsTo(() => Challenge, { onDelete: 'CASCADE' })
	challenge!: Challenge;
}

export { MultipleChoiceOption as _MultipleChoiceOption };