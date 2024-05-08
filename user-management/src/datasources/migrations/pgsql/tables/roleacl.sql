-- usermanagement.roleacl definition

-- Drop table

-- DROP TABLE usermanagement.roleacl;

CREATE TABLE usermanagement.roleacl (
	id uuid NOT NULL,
	ref_role_id uuid NOT NULL,
	ref_api_id uuid NOT NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT roleacl_pk PRIMARY KEY (id),
	CONSTRAINT roleacl_role_api_id_unique UNIQUE (ref_role_id, ref_api_id)
);


-- usermanagement.roleacl foreign keys

ALTER TABLE usermanagement.roleacl ADD CONSTRAINT roleacl_fk FOREIGN KEY (ref_role_id) REFERENCES usermanagement."role"(id);
ALTER TABLE usermanagement.roleacl ADD CONSTRAINT roleacl_fk_1 FOREIGN KEY (ref_api_id) REFERENCES usermanagement.api(id);