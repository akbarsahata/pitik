-- usermanagement.presetaccess definition

-- Drop table

-- DROP TABLE usermanagement.presetaccess;

CREATE TABLE usermanagement.presetaccess (
	id uuid NOT NULL,
	preset_name varchar(255) NOT NULL,
	preset_type varchar(50) NOT NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT presetaccess_pk PRIMARY KEY (id)
);