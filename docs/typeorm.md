
# TypeORM

Run the existing migrations:
> npm run migrate

Generate a new migration from your entity changes:
> npm run typeorm migration:generate -- -n AddColumnToUser

> npm run typeorm migration:generate -- src/database/migrations/AddUserTable -d src/database/localDataSource.ts

Run the migrations again, including the newly created one:
> npm run migrate