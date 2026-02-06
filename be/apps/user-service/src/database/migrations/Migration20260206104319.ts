import { Migration } from '@mikro-orm/migrations';

export class Migration20260206104319 extends Migration {

  override async up(): Promise<void> {
    // Drop google_name and google_avatar columns as we'll use the common avatar field
    this.addSql(`alter table "users" drop column if exists "google_name";`);
    this.addSql(`alter table "users" drop column if exists "google_avatar";`);
  }

  override async down(): Promise<void> {
    // Rollback: Add back the columns
    this.addSql(`alter table "users" add column "google_name" varchar(255) null;`);
    this.addSql(`alter table "users" add column "google_avatar" varchar(255) null;`);
  }

}
