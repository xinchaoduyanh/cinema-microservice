import { PropertyDto, Role } from '@app/common';
import { PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { AuthBaseDto } from './auth-base.dto';

export class SignUpDto extends PickType(AuthBaseDto, ['email', 'password'] as const) {
  @PropertyDto({
    type: String,
    required: true,
    validated: true,
    example: 'John Doe',
  })
  @MaxLength(50)
  @MinLength(2)
  fullName: string;

  @PropertyDto({
    type: String,
    required: false,
    validated: true,
    example: '+84901234567',
  })
  @IsOptional()
  @MaxLength(15)
  @MinLength(10)
  phone?: string;

  @PropertyDto({
    type: Role,
    structure: 'enum',
    required: false,
    validated: true,
    description: 'User role. Default is GUEST. Only ADMIN can create ADMIN/RECEPTIONIST users via this API (guarded elsewhere).',
    example: Role.GUEST,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

