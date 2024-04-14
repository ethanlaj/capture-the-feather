import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'Configuration', timestamps: false })
class Configuration extends Model {
	@AllowNull(true)
	@Column(DataType.DATE)
	startTime!: Date;

	@AllowNull(true)
	@Column(DataType.DATE)
	endTime!: Date;

	@AllowNull(true)
	@Column(DataType.JSON)
	categoryOrder!: string[];
}

export { Configuration as _Configuration };