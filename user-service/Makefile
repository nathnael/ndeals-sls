start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	db-migrate up

migrate-down:
	db-migrate down

create-migration:
	db-migrate create ${n} --sql-file

server:
	yarn run dev

.PHONEY: start_db stop_db server