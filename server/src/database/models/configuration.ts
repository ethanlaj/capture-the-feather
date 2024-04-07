import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'Configuration', timestamps: false })
class Configuration extends Model {
	@AllowNull(false)
	@Column(DataType.DATE)
	startTime!: Date;

	@AllowNull(false)
	@Column(DataType.DATE)
	endTime!: Date;
}

export { Configuration as _Configuration };