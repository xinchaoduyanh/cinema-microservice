import { EntityRepository } from '@mikro-orm/postgresql';
import { Person } from './person.entity';

export class PersonRepository extends EntityRepository<Person> {}
