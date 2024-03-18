import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Challenge, User } from ".";
import { V1ServicePort } from "@kubernetes/client-node";

@Table({ timestamps: false })
class Container extends Model {
	@PrimaryKey
	@ForeignKey(() => Challenge)
	@Column(DataType.INTEGER)
	challengeId!: number;

	@PrimaryKey
	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	userId!: number;

	@AllowNull(false)
	@Column(DataType.JSON)
	ports!: V1ServicePort[];

	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	isDeleting!: boolean;

	@AllowNull(false)
	@Column(DataType.DATE)
	expiresAt!: Date;

	@BelongsTo(() => Challenge, { onDelete: "CASCADE" })
	challenge!: Challenge;

	@BelongsTo(() => User, { onDelete: "CASCADE" })
	user!: User;
}

export { Container as _Container }