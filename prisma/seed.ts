import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  return prisma.$transaction(
    async (tx) => {
      const user = await tx.user.findFirst({ where: { name: 'Valetim' } });
      if (user) return user;

      return tx.user.create({
        data: {
          name: 'Valetim',
          email: 'valetim@gmail.com',
          password: 'bc123',
        },
      });
    },
    {
      maxWait: 20000, // default: 2000
      timeout: 50000, // default: 5000
    },
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
