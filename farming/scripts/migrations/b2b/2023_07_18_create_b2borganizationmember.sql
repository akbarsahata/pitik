-- b2b.b2b_organization_member definition

-- Drop table

-- DROP TABLE b2b.b2b_organization_member;

CREATE TABLE b2b.b2b_organization_member (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	seq_no int8 NOT NULL DEFAULT nextval('b2b.b2b_user_organization_seq_no_seq'::regclass),
	ref_organization_id uuid NOT NULL,
	ref_user_id varchar(32) NOT NULL,
	created_by varchar(32) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(32) NULL,
	modified_date timestamp NULL,
	CONSTRAINT b2b_user_organization_pk PRIMARY KEY (id)
);