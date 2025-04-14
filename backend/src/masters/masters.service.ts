import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDto } from './dto/master.dto';

@Injectable()
export class MastersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.master.findMany({ orderBy: { fullName: 'asc' } });
  }

  async findOne(id: number) {
    const master = await this.prisma.master.findUnique({ where: { id } });
    if (!master) throw new NotFoundException('Мастер не найден');
    return master;
  }

  async create(dto: CreateMasterDto) {
    return this.prisma.master.create({ data: dto });
  }

  async delete(id: number) {
    await this.findOne(id);
    return this.prisma.master.delete({ where: { id } });
  }
}
