-- usermanagement.privilege definition

-- Drop table

-- DROP TABLE usermanagement.privilege;

CREATE TABLE usermanagement.privilege (
	id uuid NOT NULL,
	ref_user_id uuid NOT NULL,
	ref_api_id uuid NOT NULL,
	expiration_date date NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT privilege_pk PRIMARY KEY (id),
	CONSTRAINT privilege_un UNIQUE (ref_user_id, ref_api_id)
);


-- usermanagement.privilege foreign keys

ALTER TABLE usermanagement.privilege ADD CONSTRAINT privilege_fk FOREIGN KEY (ref_user_id) REFERENCES usermanagement."user"(id);
ALTER TABLE usermanagement.privilege ADD CONSTRAINT privilege_fk_1 FOREIGN KEY (ref_api_id) REFERENCES usermanagement.api(id);