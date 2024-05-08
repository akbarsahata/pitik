-- usermanagement.rolerank definition

-- Drop table

-- DROP TABLE usermanagement.rolerank;

CREATE TABLE usermanagement.rolerank (
	id uuid NOT NULL,
	"rank" int4 NOT NULL,
	context varchar(50) NOT NULL,
	ref_role_id uuid NOT NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT rolerank_pk PRIMARY KEY (id),
	CONSTRAINT rolerank_unique_1 UNIQUE (rank, context, ref_role_id)
);


-- usermanagement.rolerank foreign keys

ALTER TABLE usermanagement.rolerank ADD CONSTRAINT rolerank_fk FOREIGN KEY (ref_role_id) REFERENCES usermanagement."role"(id);