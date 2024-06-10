#!/bin/sh

cd $1 || exit

echo "set up testing environment"
cp .env.example .env
docker compose up -d
sleep 10

if [ -z "$DEBUG_TEST" ]; then
  sleep 5m
fi

echo "execute tests"
docker compose exec -u root backend jest

