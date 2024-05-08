-- usermanagement."role" definition

-- Drop table

-- DROP TABLE usermanagement."role";

CREATE TABLE usermanagement."role" (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT role_pk PRIMARY KEY (id)
);