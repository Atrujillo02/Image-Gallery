PROJECT_NAME=image-gallery
DOCKER_COMPOSE=docker-compose


all: build up

build:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) build

up:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) up -d

down:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) down

logs:
	$(DOCKER_COMPOSE) -p $(PROJECT_NAME) logs -f

prune:
	docker system prune -af
	docker volume prune -f
	docker image prune -af

.PHONY: all build up down logs prune