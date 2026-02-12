export class CreateShowtimeDto {
  movieId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  price: number;
}

export class UpdateShowtimeDto {
  movieId?: string;
  roomId?: string;
  startTime?: Date;
  endTime?: Date;
  price?: number;
}
