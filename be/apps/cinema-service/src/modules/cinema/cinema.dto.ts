export class CreateCinemaDto {
  name: string;
  address: string;
  city: string;
  description?: string;
  imageUrl?: string;
}

export class UpdateCinemaDto {
  name?: string;
  address?: string;
  city?: string;
  description?: string;
  imageUrl?: string;
}
