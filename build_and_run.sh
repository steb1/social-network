echo "Building backend and frontend images..."
docker-compose build

echo "Running backend and frontend containers..."
docker-compose up -d

echo "Containers are now running."
