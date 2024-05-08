-- cms.dailymonitoring_revision definition

-- DROP TABLE cms.dailymonitoring_revision;

CREATE TABLE cms.dailymonitoring_revision (
	id varchar(36) NOT NULL DEFAULT uuid_generate_v4(),
	ref_dailymonitoring_id varchar(36) NULL,
	reason varchar NULL,
	changes _varchar NULL,
	status varchar NULL,
	snapshot_data jsonb NULL,
	created_by varchar(32) NULL,
	created_date timestamptz NULL,
	modified_by varchar(32) NULL,
	modified_date timestamptz NULL,
	CONSTRAINT dailymonitoring_revision_pk PRIMARY KEY (id),
	CONSTRAINT dailymonitoring_revision_dailymonitoring_fk FOREIGN KEY (ref_dailymonitoring_id) REFERENCES cms.dailymonitoring(id)
);
CREATE INDEX dailymonitoring_revision_ref_dailymonitoring_id_idx ON cms.dailymonitoring_revision USING btree (ref_dailymonitoring_id);
