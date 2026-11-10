import 'dotenv/config';
import {readFileSync} from 'node:fs';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';

const contractJson = JSON.parse(
  readFileSync(
    new URL('./contract.json', import.meta.url),
    'utf8',
  ),
) ;

export const contract = contractFromJson(contractJson);

export const db = postgres({
  contract,
  url: process.env['DATABASE_URL']!,
});
