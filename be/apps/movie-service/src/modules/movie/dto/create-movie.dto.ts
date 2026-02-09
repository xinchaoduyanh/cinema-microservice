import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  Min,
  IsUrl,
} from 'class-validator';
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
}
