import { Table, Column, Model, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';

@Table
export class RefreshToken extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id!: number;
}