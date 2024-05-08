
CREATE TABLE usermanagement."role" (
	id uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	created_by varchar(255) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(255) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT role_pk PRIMARY KEY (id)
);

CREATE TABLE usermanagement.api (
	id uuid NOT NULL,
	group_name varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	endpoint varchar(500) NOT NULL,
	"method" varchar(10) NOT NULL,
	created_by varchar(50) NULL,
	created_date timestamp(0) NULL,
	modified_by varchar(50) NULL,
	modified_date timestamp(0) NULL,
	additional json NULL,
	CONSTRAINT api_pk PRIMARY KEY (id),
	CONSTRAINT api_unique_1 UNIQUE (endpoint, method)
);

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

ALTER TABLE usermanagement.presetaccessd ADD CONSTRAINT presetaccessd_fk FOREIGN KEY (ref_preset_id) REFERENCES usermanagement.presetaccess(id) ON DELETE CASCADE;

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

ALTER TABLE usermanagement.roleacl ADD CONSTRAINT roleacl_fk FOREIGN KEY (ref_role_id) REFERENCES usermanagement."role"(id);
ALTER TABLE usermanagement.roleacl ADD CONSTRAINT roleacl_fk_1 FOREIGN KEY (ref_api_id) REFERENCES usermanagement.api(id);


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

ALTER TABLE usermanagement.rolerank ADD CONSTRAINT rolerank_fk FOREIGN KEY (ref_role_id) REFERENCES usermanagement."role"(id);

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

ALTER TABLE usermanagement."user" ADD CONSTRAINT user_fk FOREIGN KEY (role_id) REFERENCES usermanagement."role"(id);
ALTER TABLE usermanagement."user" ADD CONSTRAINT user_parent_fk FOREIGN KEY (parent_id) REFERENCES usermanagement."user"(id);

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

ALTER TABLE usermanagement.privilege ADD CONSTRAINT privilege_fk FOREIGN KEY (ref_user_id) REFERENCES usermanagement."user"(id);
ALTER TABLE usermanagement.privilege ADD CONSTRAINT privilege_fk_1 FOREIGN KEY (ref_api_id) REFERENCES usermanagement.api(id);