#!/bin/sh
npm run db:migrate-prod
npm run db:seed-prod
npm run start:prod
