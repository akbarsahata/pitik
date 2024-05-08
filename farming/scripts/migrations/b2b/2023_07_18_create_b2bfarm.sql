-- b2b.b2b_farm definition

-- Drop table

-- DROP TABLE b2b.b2b_farm;

CREATE TABLE b2b.b2b_farm (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	seq_no bigserial NOT NULL,
	ref_organization_id uuid NOT NULL,
	ref_farm_id varchar(32) NOT NULL,
  ref_owner_id varchar(32) NOT NULL,
	created_by varchar(32) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(32) NULL,
	modified_date timestamp(0) NULL,
	CONSTRAINT b2b_farm_pk PRIMARY KEY (id)
);