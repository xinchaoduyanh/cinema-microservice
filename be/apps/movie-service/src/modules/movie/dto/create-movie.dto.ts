import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AgeRating, MovieStatus } from '../../../data-access/movie/movie.entity';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  originalTitle?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsString()
  releaseDate: string; // ISO date string

  @IsNumber()
  @Min(1)
  duration: number;

  @IsEnum(AgeRating)
  ageRating: AgeRating;

  @IsEnum(MovieStatus)
  status: MovieStatus;

  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  @IsUrl()
  @IsOptional()
  backdropUrl?: string;

  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @IsUrl()
  @IsOptional()
  previewVideoUrl?: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genreIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  directorNames?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CastDto)
  @IsOptional()
  cast?: CastDto[];
}

export class CastDto {
  @IsString()
  name: string;

  @IsString()
  role: string;
}
