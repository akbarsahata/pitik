ALTER TABLE cms.harvest_realization ADD status varchar(10) NULL;
COMMENT ON COLUMN cms.harvest_realization.status IS 'DRAFT | FINAL | DELETED';
ALTER TABLE cms.harvest_realization ADD weighing_number varchar(50) NULL;
