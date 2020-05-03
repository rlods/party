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
	$(compose_dev) build
build-app:
	$(compose_dev) build app

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
	$(compose_dev_run) app npm run test:coverage
tests-update:
	$(compose_dev_run) app npm run test:update
tests-watch:
	$(compose_dev_run) app npm run test:watch

# STAGING
staging:
	rm -Rf $(shell pwd)/docs/*.* $(shell pwd)/docs/static/css/*.* $(shell pwd)/docs/static/js/*.*; \
	$(compose_staging) build; \
	$(compose_staging_run) -v $(shell pwd)/docs:/output app sh -c 'cp -R build/* /output'
