## Try it yourself

Try the finished application at the link: [App](http://5.129.200.241:3000/api/docs)

## Description

- Основная логика в `src/features`, конфигурация сервера в `src/config`, конфигурация БД в `src/db`,
  модуль авторизации, хелперы и утилиты в `libs`,
- Скрипты для восстановления БД приведены ниже в разделе <b>DB Setup</b>,
- Добавлена документация по стандарту Open API (Swagger) по адресу `/docs`
- Проверить можно зайдя на [App](http://5.129.200.241:3000/api/docs), либо запустив тесты по инструкции ниже
- Добавлен `Dockerfile` и `docker-compose.yml`, а также приложение запущенно на хостинге, ссылка выше.
- При запуске в докере автоматически накатываются миграции и сиды,
- Добавлена валидация входящих и сериализация выходящих данных.
- Добавлены тесты

## Installation

```bash
$ yarn install
```

## DB Setup

```bash
$ yarn db:migrate-prod #or dev
$ yarn db:seed-prod #or dev
```

## Running the app

```bash
# development
# Before start create your own .env.development
$ yarn dev

# production mode
# Before start create your own .env.production
$ yarn start:prod

# docker compose
# Before start create your own .env.production
$ docker compose up -d
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e
```
