import { config } from 'dotenv';
import { definePrismaConfig } from 'prisma/config';
import { defineConfig as ormConfig, prisma7Schema } from '@prisma/orm-postgres/config';

config();

export default definePrismaConfig({
  orm: ormConfig({
    contract: prisma7Schema('./prisma/schema.prisma'),
    output: './lib/generated/prisma',
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});