import { Table, Column, Model, DataType, ForeignKey, CreatedAt, PrimaryKey, AutoIncrement, AllowNull } from 'sequelize-typescript';
import { User } from '.';

@Table
class PointLog extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id!: number;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	userId!: number;

	@AllowNull(true)
	@Column(DataType.INTEGER)
	challengeId!: number;

	@Column(DataType.INTEGER)
	pointsAwarded!: number;

	@CreatedAt
	awardedAt!: Date;
}

export { PointLog as _PointLog };