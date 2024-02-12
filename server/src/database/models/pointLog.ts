import { Table, Column, Model, DataType, ForeignKey, CreatedAt, PrimaryKey } from 'sequelize-typescript';
import { Challenge } from './challenge';
import { User } from './user';

@Table
export class PointLog extends Model {
	@PrimaryKey
	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	userId!: number;

	@PrimaryKey
	@ForeignKey(() => Challenge)
	@Column(DataType.INTEGER)
	challengeId!: number;

	@Column(DataType.INTEGER)
	pointsAwarded!: number;

	@CreatedAt
	awardedAt!: Date;
}