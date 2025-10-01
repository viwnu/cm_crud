#!/bin/sh
yarn db:migrate-prod
yarn db:seed-prod
yarn start:prod
