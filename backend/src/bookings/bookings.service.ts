import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // Клиент создаёт заявку
  async create(userId: number, dto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        userId,
        masterId: dto.masterId,
        bookingDate: new Date(dto.bookingDate),
      },
      include: {
        master: true,
        user: { select: { id: true, fullName: true, phone: true, email: true } },
      },
    });
  }

  // Клиент видит только свои заявки; админ — все
  async findAll(userId: number, role: string) {
    const where = role === 'ADMIN' ? {} : { userId };
    return this.prisma.booking.findMany({
      where,
      include: {
        master: true,
        user: { select: { id: true, fullName: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        master: true,
        user: { select: { id: true, fullName: true, phone: true, email: true } },
      },
    });
    if (!booking) throw new NotFoundException('Заявка не найдена');
    if (role !== 'ADMIN' && booking.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этой заявке');
    }
    return booking;
  }

  // Только администратор меняет статус
  async updateStatus(id: number, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Заявка не найдена');
    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
      include: {
        master: true,
        user: { select: { id: true, fullName: true, phone: true, email: true } },
      },
    });
  }

  // Клиент может отменить свою заявку (только в статусе NEW)
  async cancel(id: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Заявка не найдена');
    if (booking.userId !== userId) throw new ForbiddenException('Нет доступа');
    if (booking.status !== 'NEW') {
      throw new ForbiddenException('Отменить можно только заявку со статусом "Новое"');
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: { master: true, user: { select: { id: true, fullName: true, phone: true, email: true } } },
    });
  }
}
