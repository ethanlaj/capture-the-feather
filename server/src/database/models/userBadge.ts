import { Table, Column, Model, PrimaryKey, DataType, ForeignKey, BelongsTo, DefaultScope } from 'sequelize-typescript';
import { Badge, User } from '.';

@DefaultScope(() => ({
	include: [{
		model: User,
		attributes: ['name']
	}]
}))
@Table
class UserBadge extends Model {
	@PrimaryKey
	@ForeignKey(() => Badge)
	@Column(DataType.INTEGER)
	badgeId!: number;

	@PrimaryKey
	@ForeignKey(() => User)
	@Column(DataType.INTEGER)
	userId!: number;

	@BelongsTo(() => Badge, { onDelete: 'CASCADE' })
	badge!: Badge;

	@BelongsTo(() => User, { onDelete: 'CASCADE' })
	user!: User;
}

export { UserBadge as _UserBadge };