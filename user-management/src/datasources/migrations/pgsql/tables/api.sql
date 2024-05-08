-- usermanagement.api definition

-- Drop table

-- DROP TABLE usermanagement.api;

CREATE TABLE usermanagement.api (
	id uuid NOT NULL,
	group_name varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	endpoint varchar(500) NOT NULL,
	"method" varchar(10) NOT NULL,
	created_by varchar(50) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(50) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT api_pk PRIMARY KEY (id),
	CONSTRAINT api_unique_1 UNIQUE (endpoint, method)
);