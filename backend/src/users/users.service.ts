import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, phone: true, email: true, role: true, createdAt: true },
    });
    return user;
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, fullName: true, phone: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
