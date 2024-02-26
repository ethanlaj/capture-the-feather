import { Table, Column, Model, AllowNull, PrimaryKey, DataType, AutoIncrement, HasMany, Default } from 'sequelize-typescript';
import { _UserBadge } from './userBadge';
import { UserBadge } from '.';
import { BadgeService } from '../../services/badgeService';

@Table
class Badge extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER)
	id!: number;

	@AllowNull(true)
	@Column(DataType.STRING)
	category!: string;

	@AllowNull(false)
	@Column(DataType.STRING)
	name!: string;

	@AllowNull(false)
	@Column(DataType.ENUM('category', 'all'))
	basedOn!: 'category' | 'all';

	@AllowNull(false)
	@Column(DataType.ENUM('challenges', 'points'))
	condition!: 'challenges' | 'points';

	@AllowNull(false)
	@Default("/images/badges/default.png")
	@Column(DataType.STRING)
	imageUrl!: string;

	@Column(DataType.VIRTUAL)
	get description(): string {
		return BadgeService.getDescription(this);
	}

	@Column(DataType.VIRTUAL)
	get earners(): string[] {
		return BadgeService.getEarnersText(this);
	}

	// If null, then user earns badge by completing all challenges in category/competition
	@AllowNull(true)
	@Column(DataType.INTEGER)
	threshold!: number;

	@HasMany(() => UserBadge)
	userBadges!: UserBadge[];
}

export { Badge as _Badge };