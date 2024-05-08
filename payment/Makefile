migration-create:
ifeq ($(name),)
	@echo "Please provide migration name"
else
	@./node_modules/.bin/typeorm migration:create src/datasources/migration/postgresql/$(name)
endif
