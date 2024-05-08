ALTER TABLE cms.dailymonitoring ADD id varchar(36) NOT NULL DEFAULT uuid_generate_v4();
ALTER TABLE cms.dailymonitoring ADD cull int4 NULL;
ALTER TABLE cms.dailymonitoring ADD mortality_image varchar NULL;
ALTER TABLE cms.dailymonitoring ADD remarks varchar NULL;
ALTER TABLE cms.dailymonitoring ADD recording_image varchar NULL;
ALTER TABLE cms.dailymonitoring ADD hdp float4 NULL;
ALTER TABLE cms.dailymonitoring ADD created_by varchar(32) NULL;
ALTER TABLE cms.dailymonitoring ADD modified_by varchar(32) NULL;
ALTER TABLE cms.dailymonitoring ADD CONSTRAINT dailymonitoring_unique UNIQUE (ref_farmingcycle_id, date);
ALTER TABLE cms.dailymonitoring ADD CONSTRAINT dailymonitoring_id UNIQUE (id);
ALTER TABLE cms.dailymonitoring DROP CONSTRAINT dailymonitoring_fk_1;
ALTER TABLE cms.dailymonitoring ALTER COLUMN ref_taskticket_id DROP NOT NULL;
ALTER TABLE cms.dailymonitoring ADD egg_weight float4 NULL;
ALTER TABLE cms.dailymonitoring ADD egg_mass float4 NULL;
