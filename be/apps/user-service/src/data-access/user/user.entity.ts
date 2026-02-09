import { Gender, Role } from '@app/common';
import { Entity, EntityRepositoryType, Filter, Property, Enum, Index } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/data-access/base.entity';
import { UserRepository } from 'src/data-access/user/user.repository';

@Filter({
  name: 'softDelete',
  cond: () => ({ deletedAt: null }),
  default: true,
})
@Entity({ tableName: 'users', repository: () => UserRepository })
export class User extends BaseEntity<User> {
  [EntityRepositoryType]?: UserRepository;

  @Property({ unique: true })
  @Index()
  email: string;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ nullable: true })
  fullName?: string;

  @Property({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Enum({ items: () => Gender, nullable: true })
  gender?: Gender;

  @Property({ nullable: true })
  @Index()
  phoneNumber?: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ default: true })
  isActive: boolean = true;

  @Exclude()
  @Property()
  password: string;

  @Property({ default: false })
  emailVerified: boolean = false;

  @Enum({ items: () => Role })
  @Index()
  role: Role;

  @Property({ type: 'timestamp with time zone', nullable: true })
  passwordChangedAt?: Date;

  @Property({ unique: true, nullable: true })
  @Index()
  googleId?: string;

  @Property({ fieldName: 'is_2fa_enabled', default: false })
  is2faEnabled: boolean = false;

  @Exclude()
  @Property({ type: 'text', nullable: true })
  refreshToken?: string;

  @Property({ type: 'timestamp with time zone', nullable: true })
  lastLoginAt?: Date;
}

