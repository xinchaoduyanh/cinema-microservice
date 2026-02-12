import { Migration } from '@mikro-orm/migrations';

export class Migration20260209030607 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "genres" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" text null, constraint "genres_pkey" primary key ("id"));`);
    this.addSql(`create index "genres_name_index" on "genres" ("name");`);
    this.addSql(`alter table "genres" add constraint "genres_name_unique" unique ("name");`);
    this.addSql(`create index "genres_slug_index" on "genres" ("slug");`);
    this.addSql(`alter table "genres" add constraint "genres_slug_unique" unique ("slug");`);

    this.addSql(`create table "movies" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "title" varchar(255) not null, "original_title" varchar(255) null, "description" text not null, "long_description" text null, "release_date" date not null, "duration" int not null, "rating" numeric(2,1) not null default 0, "rotten_tomatoes" int null, "trailer_url" varchar(255) null, "backdrop_url" varchar(255) null, "poster_url" varchar(255) null, "preview_video_url" varchar(255) null, "accent_color" varchar(255) null, "status" text check ("status" in ('COMING_SOON', 'NOW_SHOWING', 'ENDED')) not null, "age_rating" text check ("age_rating" in ('P', 'C13', 'C16', 'C18')) not null, "stills" jsonb null, constraint "movies_pkey" primary key ("id"));`);
    this.addSql(`create index "movies_title_index" on "movies" ("title");`);
    this.addSql(`create index "movies_status_index" on "movies" ("status");`);

    this.addSql(`create table "movie_genres" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "movie_id" uuid not null, "genre_id" uuid not null, constraint "movie_genres_pkey" primary key ("id"));`);

    this.addSql(`create table "persons" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "name" varchar(255) not null, "image" varchar(255) null, "bio" text null, constraint "persons_pkey" primary key ("id"));`);
    this.addSql(`create index "persons_name_index" on "persons" ("name");`);

    this.addSql(`create table "movie_directors" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "movie_id" uuid not null, "director_id" uuid not null, constraint "movie_directors_pkey" primary key ("id"));`);

    this.addSql(`create table "movie_cast" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "movie_id" uuid not null, "person_id" uuid not null, "role_name" varchar(255) not null, constraint "movie_cast_pkey" primary key ("id"));`);

    this.addSql(`alter table "movie_genres" add constraint "movie_genres_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "movie_genres" add constraint "movie_genres_genre_id_foreign" foreign key ("genre_id") references "genres" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "movie_directors" add constraint "movie_directors_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "movie_directors" add constraint "movie_directors_director_id_foreign" foreign key ("director_id") references "persons" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "movie_cast" add constraint "movie_cast_movie_id_foreign" foreign key ("movie_id") references "movies" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "movie_cast" add constraint "movie_cast_person_id_foreign" foreign key ("person_id") references "persons" ("id") on update cascade on delete cascade;`);
  }

}
