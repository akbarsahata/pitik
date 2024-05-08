-- usermanagement.presetaccessd definition

-- Drop table

-- DROP TABLE usermanagement.presetaccessd;

CREATE TABLE usermanagement.presetaccessd (
	id uuid NOT NULL,
	ref_preset_id uuid NOT NULL,
	ref_api_id uuid NOT NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT presetaccessd_pk PRIMARY KEY (id)
);


-- usermanagement.presetaccessd foreign keys

ALTER TABLE usermanagement.presetaccessd ADD CONSTRAINT presetaccessd_fk FOREIGN KEY (ref_preset_id) REFERENCES usermanagement.presetaccess(id) ON DELETE CASCADE;