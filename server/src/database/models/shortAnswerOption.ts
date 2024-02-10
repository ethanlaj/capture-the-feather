import { Table, Column, Model, AllowNull, PrimaryKey, DataType, BelongsTo, ForeignKey, AutoIncrement } from 'sequelize-typescript';
import { Challenge } from './challenge';

@Table
export class ShortAnswerOption extends Model {
	@PrimaryKey
	@AutoIncrement
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
	@Column(DataType.ENUM('static', 'regex'))
	matchMode!: 'static' | 'regex';

	@AllowNull(true)
	@Column(DataType.STRING)
	regExp!: string;

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	isCaseSensitive!: boolean;

	@BelongsTo(() => Challenge, { onDelete: 'CASCADE' })
	challenge!: Challenge;
}