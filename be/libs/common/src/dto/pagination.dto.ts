import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

const toNumber = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() !== '' ? Number(value) : value;

export class PaginationQueryDto {
  @ApiPropertyOptional({
    type: Number,
    example: 1,
    description: 'This field is used for normal pagination',
  })
  @Transform(toNumber)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    type: Number,
    example: 20,
  })
  @Transform(toNumber)
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}

export class PaginationMetadataResponseDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  total: number;
}

export class PaginationResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({
    type: PaginationMetadataResponseDto,
  })
  pagination: PaginationMetadataResponseDto;
}

export type PaginationResult<T> = {
  data: T[];
  pagination: PaginationMetadataResponseDto;
};

/** Creates a uniform pagination response from any ORM/query implementation. */
export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  query: Pick<PaginationQueryDto, 'page' | 'pageSize'>,
): PaginationResult<T> => ({
  data,
  pagination: {
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.ceil(total / query.pageSize),
  },
});
