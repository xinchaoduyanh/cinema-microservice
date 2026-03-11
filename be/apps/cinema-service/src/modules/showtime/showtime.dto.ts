import { IsString, IsNumber, Min, IsOptional, IsDateString } from 'class-validator';

export class CreateShowtimeDto {
  @IsString()
  movieId: string;

  @IsString()
  roomId: string;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateShowtimeDto {
  @IsString()
  @IsOptional()
  movieId?: string;

  @IsString()
  @IsOptional()
  roomId?: string;

  @IsDateString()
  @IsOptional()
  startTime?: Date;

  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}

