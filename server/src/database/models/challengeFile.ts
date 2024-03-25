import { AllowNull, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Challenge } from ".";

@Table({ timestamps: false })
class ChallengeFile extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id!: number;

	@ForeignKey(() => Challenge)
	@Column(DataType.INTEGER)
	challengeId!: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	filename!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	mimetype!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	path!: string;

	@BelongsTo(() => Challenge, { onDelete: "CASCADE" })
	challenge!: Challenge;
}

export { ChallengeFile as _ChallengeFile }