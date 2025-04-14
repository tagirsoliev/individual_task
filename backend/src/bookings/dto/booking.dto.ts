import { IsNotEmpty, IsInt, IsDateString, IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @IsInt({ message: 'masterId должен быть числом' })
  masterId: number;

  @IsDateString({}, { message: 'Некорректный формат даты и времени' })
  bookingDate: string;
}

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus, { message: 'Статус должен быть NEW, CONFIRMED или REJECTED' })
  status: BookingStatus;
}
