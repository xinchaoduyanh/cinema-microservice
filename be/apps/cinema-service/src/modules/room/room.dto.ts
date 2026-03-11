import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { SeatType } from '../../data-access/seat/seat.entity';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  screenType?: string;

  @IsString()
  cinemaId: string;
}

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  screenType?: string;

  @IsString()
  @IsOptional()
  cinemaId?: string;
}

export class GenerateSeatsDto {
  @IsNumber()
  @Min(1)
  numberOfRows: number;

  @IsNumber()
  @Min(1)
  seatsPerRow: number;

  @IsEnum(SeatType)
  @IsOptional()
  type?: SeatType = SeatType.STANDARD;
}

