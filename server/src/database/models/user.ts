import { Table, Column, Model, AllowNull, PrimaryKey, DataType, Default, Unique } from 'sequelize-typescript';

@Table
export class User extends Model {
	@PrimaryKey
	@Column(DataType.UUID)
	id!: string;

	@AllowNull(false)
	@Unique
	@Column(DataType.STRING)
	email!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	name!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	passwordHash!: string;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	isAdmin!: boolean;
}