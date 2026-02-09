import { Migration } from '@mikro-orm/migrations';

export class Migration20260209025801_fix_user_entity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "refresh_token" text null, add column "last_login_at" timestamptz null;`);
    this.addSql(`alter table "users" alter column "gender" type text using ("gender"::text);`);
    this.addSql(`alter table "users" alter column "role" type text using ("role"::text);`);
    this.addSql(`alter table "users" alter column "password_changed_at" type timestamptz using ("password_changed_at"::timestamptz);`);
    this.addSql(`alter table "users" add constraint "users_gender_check" check("gender" in ('Male', 'Female', 'Other'));`);
    this.addSql(`alter table "users" add constraint "users_role_check" check("role" in ('ADMIN', 'RECEPTIONIST', 'GUEST'));`);
    this.addSql(`create index "users_email_index" on "users" ("email");`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`create index "users_phone_number_index" on "users" ("phone_number");`);
    this.addSql(`create index "users_role_index" on "users" ("role");`);
    this.addSql(`create index "users_google_id_index" on "users" ("google_id");`);
    this.addSql(`alter table "users" add constraint "users_google_id_unique" unique ("google_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint if exists "users_gender_check";`);
    this.addSql(`alter table "users" drop constraint if exists "users_role_check";`);

    this.addSql(`drop index "users_email_index";`);
    this.addSql(`alter table "users" drop constraint "users_email_unique";`);
    this.addSql(`drop index "users_phone_number_index";`);
    this.addSql(`drop index "users_role_index";`);
    this.addSql(`drop index "users_google_id_index";`);
    this.addSql(`alter table "users" drop constraint "users_google_id_unique";`);
    this.addSql(`alter table "users" drop column "refresh_token", drop column "last_login_at";`);

    this.addSql(`alter table "users" alter column "gender" type varchar(255) using ("gender"::varchar(255));`);
    this.addSql(`alter table "users" alter column "role" type varchar(255) using ("role"::varchar(255));`);
    this.addSql(`alter table "users" alter column "password_changed_at" type date using ("password_changed_at"::date);`);
  }

}
