CREATE TABLE cms.dailymonitoring_mortality (
	id varchar(36) NOT NULL,
	dailymonitoring_id varchar(36) NOT NULL,
	quantity float4 NOT NULL DEFAULT 0,
	cause varchar NULL,
	created_by varchar(32) NOT NULL,
	created_date timestamp NOT NULL DEFAULT now(),
	modified_by varchar(32) NOT NULL,
	modified_date timestamp NOT NULL DEFAULT now(),
	deleted_date timestamp NULL,
	CONSTRAINT dailymonitoring_mortality_pk PRIMARY KEY (id)
);
