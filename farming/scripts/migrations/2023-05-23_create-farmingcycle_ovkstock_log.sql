-- cms.farmingcycle_ovkstock_log definition

-- Drop table

-- DROP TABLE cms.farmingcycle_ovkstock_log;

CREATE TABLE cms.farmingcycle_ovkstock_log (
	id varchar NOT NULL,
	farmingcycle_id varchar NULL,
	subcategory_code varchar NULL,
	subcategory_name varchar NULL,
	product_code varchar NULL,
	product_name varchar NULL,
	uom varchar NULL,
	quantity float8 NULL,
	"operator" bpchar(1) NULL,
	taskticket_id varchar NULL,
	taskticket_d_id varchar NULL,
	notes text NULL,
	created_by varchar NULL,
	created_date timestamp NULL,
	modified_by varchar NULL,
	modified_date timestamp NULL,
	CONSTRAINT farmingcycle_ovk_log_pk PRIMARY KEY (id),
	CONSTRAINT farmingcycle_ovk_log_fk FOREIGN KEY (farmingcycle_id) REFERENCES cms.t_farmingcycle(id) ON DELETE SET NULL ON UPDATE SET NULL,
	CONSTRAINT farmingcycle_ovk_log_fk_1 FOREIGN KEY (created_by) REFERENCES cms.t_user(id) ON DELETE SET NULL ON UPDATE SET NULL,
	CONSTRAINT farmingcycle_ovk_log_fk_2 FOREIGN KEY (modified_by) REFERENCES cms.t_user(id) ON DELETE SET NULL ON UPDATE SET NULL,
	CONSTRAINT farmingcycle_ovk_log_fk_3 FOREIGN KEY (taskticket_id) REFERENCES cms.t_taskticket(id) ON DELETE SET NULL ON UPDATE SET NULL,
	CONSTRAINT farmingcycle_ovk_log_fk_4 FOREIGN KEY (taskticket_d_id) REFERENCES cms.t_taskticket_d(id) ON DELETE SET NULL ON UPDATE SET NULL
);
CREATE INDEX farmingcycle_ovk_log_farmingcycle_id_idx ON cms.farmingcycle_ovkstock_log USING btree (farmingcycle_id);
CREATE INDEX farmingcycle_ovk_log_taskticket_d_id_idx ON cms.farmingcycle_ovkstock_log USING btree (taskticket_d_id);
CREATE INDEX farmingcycle_ovk_log_taskticket_id_idx ON cms.farmingcycle_ovkstock_log USING btree (taskticket_id);

-- Table Triggers

create trigger notify_audit after
insert
    or
delete
    or
update
    on
    cms.farmingcycle_ovkstock_log for each row execute function notify_audit();