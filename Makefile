SHELL:=/bin/bash

define compose_dev
	docker-compose -p party_dev -f docker-compose.yml -f docker-compose.dev.yml
endef

define compose_dev_run
	$(compose_dev) run --rm --no-deps
endef

define compose_staging
	docker-compose -p party_staging -f docker-compose.yml -f docker-compose.staging.yml
endef

define compose_staging_run
	$(compose_staging) run --rm --no-deps
endef

# BUILD
build:
	$(compose_dev) build --force-rm
build-app:
	$(compose_dev) build --force-rm app

# INSTALL
install: install-app
install-app:
	$(compose_dev_run) app npm install --unsafe-perm=true

# DEV
start:
	$(compose_dev) up app proxy
stop:
	$(compose_dev) down

# SHELL
shell-app:
	$(compose_dev_run) app /bin/sh

# LOGS
logs:
	$(compose_dev) logs
logs-app:
	$(compose_dev) logs app

# LINT
lint: lint-app
lint-app:
	$(compose_dev_run) app npm run lint

# TESTS
tests:
	$(compose_dev_run) app npm run test
tests-coverage:
	rm -Rf services/app/coverage; mkdir services/app/coverage; \
	$(compose_dev_run) app npm run test:coverage
tests-update:
	$(compose_dev_run) app npm run test:update
tests-watch:
	$(compose_dev_run) app npm run test:watch

# STAGING
staging:
	rm -Rf services/app/build; mkdir services/app/build; \
	$(compose_staging) build --force-rm; \
	$(compose_staging_run) app npm install --production=false --unsafe-perm=true --no-audit; \
	$(compose_staging_run) app npm run build:staging;
