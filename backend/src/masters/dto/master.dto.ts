import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMasterDto {
  @IsNotEmpty({ message: 'ФИО мастера обязательно' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'Специализация обязательна' })
  @IsString()
  specialty: string;
}
