-- usermanagement."user" definition

-- Drop table

-- DROP TABLE usermanagement."user";

CREATE TABLE usermanagement."user" (
	id uuid NOT NULL,
	full_name varchar(255) NOT NULL,
	email varchar(255) NULL,
	phone varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	status bool NOT NULL DEFAULT true,
	lang varchar(4) NOT NULL DEFAULT 'id'::character varying,
	accept_tnc int2 NOT NULL DEFAULT 0,
	parent_id uuid NULL,
	role_id uuid NOT NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT user_pk PRIMARY KEY (id),
	CONSTRAINT username_unique_key UNIQUE (full_name, email, phone)
);


-- usermanagement."user" foreign keys

ALTER TABLE usermanagement."user" ADD CONSTRAINT user_fk FOREIGN KEY (role_id) REFERENCES usermanagement."role"(id);
ALTER TABLE usermanagement."user" ADD CONSTRAINT user_parent_fk FOREIGN KEY (parent_id) REFERENCES usermanagement."user"(id);