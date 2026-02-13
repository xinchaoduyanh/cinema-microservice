import { Migration } from '@mikro-orm/migrations';

export class Migration20260213051156 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cinema" add column "latitude" numeric(10,7) null, add column "longitude" numeric(10,7) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cinema" drop column "latitude", drop column "longitude";`);
  }

}
