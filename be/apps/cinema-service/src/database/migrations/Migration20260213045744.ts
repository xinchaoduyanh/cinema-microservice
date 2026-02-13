import { Migration } from '@mikro-orm/migrations';

export class Migration20260213045744 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "movie_genres" drop constraint "movie_genres_genre_id_foreign";`);

    this.addSql(`alter table "movie_cast" drop constraint "movie_cast_movie_id_foreign";`);

    this.addSql(`alter table "movie_directors" drop constraint "movie_directors_movie_id_foreign";`);

    this.addSql(`alter table "movie_genres" drop constraint "movie_genres_movie_id_foreign";`);

    this.addSql(`alter table "movie_cast" drop constraint "movie_cast_person_id_foreign";`);

    this.addSql(`alter table "movie_directors" drop constraint "movie_directors_director_id_foreign";`);

    this.addSql(`create table "cinema" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, "address" varchar(255) not null, "city" varchar(255) null, "description" varchar(255) null, "image_url" varchar(255) null, constraint "cinema_pkey" primary key ("id"));`);

    this.addSql(`create table "room" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, "screen_type" varchar(255) not null default '2D', "cinema_id" uuid not null, constraint "room_pkey" primary key ("id"));`);

    this.addSql(`create table "seat" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "row" varchar(255) not null, "column" int not null, "type" text check ("type" in ('STANDARD', 'VIP', 'SWEETBOX')) not null default 'STANDARD', "room_id" uuid not null, constraint "seat_pkey" primary key ("id"));`);

    this.addSql(`create table "showtime" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "movie_id" uuid not null, "room_id" uuid not null, "start_time" timestamptz not null, "end_time" timestamptz not null, "price" numeric(10,2) not null, "currency" varchar(255) not null default 'VND', constraint "showtime_pkey" primary key ("id"));`);

    this.addSql(`create table "showtime_seat" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "showtime_id" uuid not null, "seat_id" uuid not null, "status" text check ("status" in ('AVAILABLE', 'LOCKED', 'BOOKED')) not null default 'AVAILABLE', "booking_id" uuid null, "locked_at" timestamptz null, constraint "showtime_seat_pkey" primary key ("id"));`);

    this.addSql(`alter table "room" add constraint "room_cinema_id_foreign" foreign key ("cinema_id") references "cinema" ("id") on update cascade;`);

    this.addSql(`alter table "seat" add constraint "seat_room_id_foreign" foreign key ("room_id") references "room" ("id") on update cascade;`);

    this.addSql(`alter table "showtime" add constraint "showtime_room_id_foreign" foreign key ("room_id") references "room" ("id") on update cascade;`);

    this.addSql(`alter table "showtime_seat" add constraint "showtime_seat_showtime_id_foreign" foreign key ("showtime_id") references "showtime" ("id") on update cascade;`);
    this.addSql(`alter table "showtime_seat" add constraint "showtime_seat_seat_id_foreign" foreign key ("seat_id") references "seat" ("id") on update cascade;`);

    this.addSql(`drop table if exists "genres" cascade;`);

    this.addSql(`drop table if exists "movie_cast" cascade;`);

    this.addSql(`drop table if exists "movie_directors" cascade;`);

    this.addSql(`drop table if exists "movie_genres" cascade;`);

    this.addSql(`drop table if exists "movies" cascade;`);

    this.addSql(`drop table if exists "persons" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "room" drop constraint "room_cinema_id_foreign";`);

    this.addSql(`alter table "seat" drop constraint "seat_room_id_foreign";`);

    this.addSql(`alter table "showtime" drop constraint "showtime_room_id_foreign";`);

    this.addSql(`alter table "showtime_seat" drop constraint "showtime_seat_seat_id_foreign";`);

    this.addSql(`alter table "showtime_seat" drop constraint "showtime_seat_showtime_id_foreign";`);

    this.addSql(`create table "genres" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "deleted_at" timestamptz(6) null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" text null, constraint "genres_pkey" primary key ("id"));`);
    this.addSql(`create index "genres_name_index" on "genres" ("name");`);
    this.addSql(`alter table "genres" add constraint "genres_name_unique" unique ("name");`);
    this.addSql(`create index "genres_slug_index" on "genres" ("slug");`);
    this.addSql(`alter table "genres" add constraint "genres_slug_unique" unique ("slug");`);

    this.addSql(`create table "movie_cast" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "deleted_at" timestamptz(6) null, "movie_id" uuid not null, "person_id" uuid not null, "role_name" varchar(255) not null, constraint "movie_cast_pkey" primary key ("id"));`);

    this.addSql(`create table "movie_directors" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "deleted_at" timestamptz(6) null, "movie_id" uuid not null, "director_id" uuid not null, constraint "movie_directors_pkey" primary key ("id"));`);

    this.addSql(`create table "movie_genres" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "deleted_at" timestamptz(6) null, "movie_id" uuid not null, "genre_id" uuid not null, constraint "movie_genres_pkey" primary key ("id"));`);

    this.addSql(`create table "movies" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "deleted_at" timestamptz(6) null, "title" varchar(255) not null, "original_title" varchar(255) null, "description" text not null, "long_description" text null, "release_date" date not null, "duration" int4 not null, "rating" numeric(2,1) not null default 0, "rotten_tomatoes" int4 null, "trailer_url" varchar(255) null, "backdrop_url" varchar(255) null, "poster_url" varchar(255) null, "preview_video_url" varchar(255) null, "accent_color" varchar(255) null, "status" text check ("status" in ('COMING_SOON', 'NOW_SHOWING', 'ENDED')) not null, "age_rating" text check ("age_rating" in ('P', 'C13', 'C16', 'C18')) not null, "stills" jsonb null, constraint "movies_pkey" primary key ("id"));`);
    this.addSql(`create index "movies_status_index" on "movies" ("status");`);
    this.addSql(`create index "movies_title_index" on "movies" ("title");`);

    this.addSql(`create table "persons" ("id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "deleted_at" timestamptz(6) null, "name" varchar(255) not null, "image" varchar(255) null, "bio" text null, constraint "persons_pkey" primary key ("id"));`);
    this.addSql(`create index "persons_name_index" on "persons" ("name");`);

    this.addSql(`alter table "movie_cast" add constraint "movie_cast_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "movie_cast" add constraint "movie_cast_person_id_foreign" foreign key ("person_id") references "persons" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "movie_directors" add constraint "movie_directors_director_id_foreign" foreign key ("director_id") references "persons" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "movie_directors" add constraint "movie_directors_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "movie_genres" add constraint "movie_genres_genre_id_foreign" foreign key ("genre_id") references "genres" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "movie_genres" add constraint "movie_genres_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "cinema" cascade;`);

    this.addSql(`drop table if exists "room" cascade;`);

    this.addSql(`drop table if exists "seat" cascade;`);

    this.addSql(`drop table if exists "showtime" cascade;`);

    this.addSql(`drop table if exists "showtime_seat" cascade;`);
  }

}
