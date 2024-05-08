-- cms.farmingcycle_feedstock_adjustment definition

-- Drop table

-- DROP TABLE cms.farmingcycle_feedstock_adjustment;

CREATE TABLE cms.farmingcycle_feedstock_adjustment (
	id varchar NOT NULL,
	farmingcycle_feedstock_summary_id varchar NULL,
	farmingcycle_id varchar NULL,
	adjustment_quantity float8 NULL,
	"type" varchar NULL,
	created_by varchar NULL,
	created_date timestamp NULL,
	modified_by varchar NULL,
	modified_date timestamp NULL,
	uom varchar NULL DEFAULT 'karung'::character varying,
	CONSTRAINT farmingcycle_feedstock_adjustment_pk PRIMARY KEY (id),
	CONSTRAINT farmingcycle_feedstock_adjustment_fk FOREIGN KEY (farmingcycle_feedstock_summary_id) REFERENCES cms.farmingcycle_feedstock_summary(id) ON DELETE SET NULL ON UPDATE SET NULL,
	CONSTRAINT farmingcycle_feedstock_adjustment_fk_1 FOREIGN KEY (farmingcycle_id) REFERENCES cms.t_farmingcycle(id) ON DELETE SET NULL ON UPDATE SET NULL
);

-- Table Triggers

create trigger notify_audit after
insert
    or
delete
    or
update
    on
    cms.farmingcycle_feedstock_adjustment for each row execute function notify_audit();
