-- usermanagement.platform_name enum type

CREATE TYPE usermanagement.platform_name AS ENUM (
	'downstreamApp',
	'fms',
	'pplApp',
	'ownerApp');

-- usermanagement.module definition

CREATE TABLE "module" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	platform_name usermanagement.platform_name NOT NULL,
	module_name varchar(50) NOT NULL,
	CONSTRAINT module_pk PRIMARY KEY (id)
);
