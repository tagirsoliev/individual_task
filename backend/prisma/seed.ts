import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Администратор
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@barbershop.ru' },
    update: {},
    create: {
      fullName: 'Администратор Системы',
      phone: '+70000000000',
      email: 'admin@barbershop.ru',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Мастера — createMany игнорирует дубликаты
  const mastersCount = await prisma.master.count();
  if (mastersCount === 0) {
    await prisma.master.createMany({
      data: [
        { fullName: 'Иванов Алексей Петрович', specialty: 'Барбер' },
        { fullName: 'Смирнова Ольга Николаевна', specialty: 'Стилист' },
        { fullName: 'Козлов Дмитрий Сергеевич', specialty: 'Колорист' },
        { fullName: 'Новикова Анна Владимировна', specialty: 'Барбер' },
      ],
    });
  }

  console.log('Seed завершён: администратор и мастера созданы');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
