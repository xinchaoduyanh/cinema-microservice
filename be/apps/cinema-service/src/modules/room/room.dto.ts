export class CreateRoomDto {
  name: string;
  screenType: string;
  cinemaId: string;
}

export class UpdateRoomDto {
  name?: string;
  screenType?: string;
  cinemaId?: string;
}
