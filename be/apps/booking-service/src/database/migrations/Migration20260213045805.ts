import { Migration } from '@mikro-orm/migrations';

export class Migration20260213045805 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "booking" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "user_id" uuid not null, "showtime_id" uuid not null, "status" text check ("status" in ('PENDING', 'CONFIRMED', 'CANCELLED', 'PAID')) not null default 'PENDING', "total_amount" numeric(10,2) not null default 0, "promotion_id" uuid null, "discount_amount" numeric(10,2) not null default 0, constraint "booking_pkey" primary key ("id"));`);

    this.addSql(`create table "booking_item" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "booking_id" uuid not null, "type" text check ("type" in ('SEAT', 'PRODUCT')) not null, "item_id" uuid not null, "quantity" int not null default 1, "price" numeric(10,2) not null, constraint "booking_item_pkey" primary key ("id"));`);

    this.addSql(`create table "product" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, "description" varchar(255) null, "price" numeric(10,2) not null, "stock" int not null default 0, "image_url" varchar(255) null, "is_active" boolean not null default true, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`create table "promotion" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "code" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "discount_type" text check ("discount_type" in ('PERCENTAGE', 'FIXED_AMOUNT')) not null default 'PERCENTAGE', "discount_value" numeric(10,2) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "minimum_order_value" numeric(10,2) null, "is_active" boolean not null default true, constraint "promotion_pkey" primary key ("id"));`);

    this.addSql(`alter table "booking_item" add constraint "booking_item_booking_id_foreign" foreign key ("booking_id") references "booking" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "booking_item" drop constraint "booking_item_booking_id_foreign";`);

    this.addSql(`drop table if exists "booking" cascade;`);

    this.addSql(`drop table if exists "booking_item" cascade;`);

    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "promotion" cascade;`);
  }

}
