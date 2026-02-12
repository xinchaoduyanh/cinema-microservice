export class CreateSeatDto {
  row: string;
  column: number;
  type: string; // SeatType enum
  roomId: string;
}

export class CreateSeatsDto {
  roomId: string;
  rows: string[];
  columns: number;
  type: string;
}
