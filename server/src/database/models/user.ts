import { Table, Column, Model, AllowNull, PrimaryKey, DataType, Default, Unique, AutoIncrement, HasMany } from 'sequelize-typescript';
import { Attempt } from '.';

@Table
class User extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id!: number;

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
	@Default(0)
	@Column(DataType.INTEGER)
	totalPoints!: number;

	@AllowNull(false)
	@Default(false)
	@Column(DataType.BOOLEAN)
	isAdmin!: boolean;

	@HasMany(() => Attempt)
	attempts!: Attempt[];
}

export { User as _User };