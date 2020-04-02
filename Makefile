SHELL:=/bin/bash

define compose_dev
	docker-compose -p party_dev -f docker-compose.yml -f docker-compose.dev.yml
endef

define compose_dev_run
	$(compose_dev) run --rm --no-deps
endef

define compose_prod
	docker-compose -p party_prod -f docker-compose.yml -f docker-compose.prod.yml
endef

define compose_prod_run
	$(compose_prod) run --rm --no-deps
endef

# BUILD
build:
	$(compose_dev) build

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

# PROD
prod:
	rm -Rf $(shell pwd)/docs/*.* $(shell pwd)/docs/static/css/*.* $(shell pwd)/docs/static/js/*.*; \
	$(compose_prod) build; \
	$(compose_prod_run) -v $(shell pwd)/docs:/output app sh -c 'cp -R build/* /output'
