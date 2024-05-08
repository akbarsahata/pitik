-- usermanagement.app definition

-- Drop table

-- DROP TABLE usermanagement.app;

CREATE TABLE usermanagement.app (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	url varchar(255) NULL,
	logo varchar(255) NULL,
	"key" varchar(255) NULL,
	about text NULL,
	ref_user_id uuid NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT app_pk PRIMARY KEY (id)
);


-- usermanagement.app foreign keys

ALTER TABLE usermanagement.app ADD CONSTRAINT app_fk FOREIGN KEY (ref_user_id) REFERENCES usermanagement."user"(id);