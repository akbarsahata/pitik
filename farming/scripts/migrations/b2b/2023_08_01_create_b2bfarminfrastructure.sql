-- b2b.b2b_farm_infrastructure definition

-- Drop table

DROP TABLE b2b.b2b_farm_infrastructure;

CREATE TABLE b2b.b2b_farm_infrastructure (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	seq_no bigserial NOT NULL,
  ref_organization_id varchar(36) NOT NULL,
	ref_farm_id varchar(32) NOT NULL,
	ref_coop_id varchar(32) NOT NULL,
	ref_building_id varchar(32) NOT NULL,
	created_by varchar(32) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(32) NULL,
	modified_date timestamp(0) NULL,
	CONSTRAINT b2b_farm_infrastructure_pk PRIMARY KEY (id)
);