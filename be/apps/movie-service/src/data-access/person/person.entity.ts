import { Entity, Property, Index, Filter } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { PersonRepository } from 'src/data-access/person/person.repository';

@Filter({
  name: 'softDelete',
  cond: () => ({ deletedAt: null }),
  default: true,
})
@Entity({ tableName: 'persons', repository: () => PersonRepository })
export class Person extends BaseEntity<Person> {
  @Property()
  @Index()
  name: string;

  @Property({ nullable: true })
  image?: string;

  @Property({ type: 'text', nullable: true })
  bio?: string;
}
