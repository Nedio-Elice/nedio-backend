import { IsOptional, IsString } from 'class-validator';
import { User } from '../schema/user.schema';

export class CreateUserDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly nickname: string;

  @IsString()
  readonly profileURL: string;

  @IsString()
  readonly contact: string;

  @IsString()
  readonly introduce: string;

  @IsOptional()
  readonly user: User;
}
