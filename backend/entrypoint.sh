#!/bin/sh
# entrypoint.sh

# Wait to docker enable the DB
until nc -z db 3306; do
  echo "Waiting for database..."
  sleep 1
done

echo "Database ready! Running migrations and seed..."
npx prisma migrate deploy --schema=src/dataAccess/prisma/schema.prisma
npx prisma generate --schema=src/dataAccess/prisma/schema.prisma
npx ts-node src/dataAccess/prisma/seed.ts

while [ ! -d /shared ]; do
  echo "Waiting for /shared to be mounted..."
  sleep 1
done

echo "/shared is mounted."

# Exec backend
exec npx nodemon src/index.ts