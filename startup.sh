#!/bin/sh

echo "Running"
echo "Waiting for test_pgdb services to start..."

wait_for_port() {
  HOST=$1
  PORT=$2

  while true; do
    nc -z "$HOST" "$PORT"
    result=$?

    if [ $result -eq 0 ]; then
      echo "Port $PORT on host $HOST is open. Service is ready!"
      break
    else
      echo "Port $PORT on host $HOST is not open. Waiting..."
      sleep 1
    fi
  done
}

# Call the function with test_pgdb
wait_for_port "test_pgdb" "5432"

# /bin/sh /app/process.sh test_pgdb:5432 -- echo "PostgreSQL is ready!"

