CREATE TABLE cms.farmingcycle_ovkstock_summary (
	id varchar NOT NULL,
	farmingcycle_id varchar NOT NULL,
	subcategory_code varchar NULL,
	subcategory_name varchar NULL,
	product_code varchar NULL,
	product_name varchar null,
	remaining_quantity float4 NULL,
	uom varchar NULL,
	created_by varchar NULL,
	created_date timestamp NULL,
	modified_by varchar NULL,
	modified_date timestamp NULL,
	CONSTRAINT farmingcycle_ovkstock_summary_pk PRIMARY KEY (id),
	CONSTRAINT farmingcycle_ovkstock_summary_un UNIQUE (farmingcycle_id, product_name),
	CONSTRAINT farmingcycle_ovkstock_summary_fk FOREIGN KEY (farmingcycle_id) REFERENCES cms.t_farmingcycle(id) ON DELETE SET NULL ON UPDATE SET NULL
);


create trigger notify_audit after
insert
    or
delete
    or
update
    on
    cms.farmingcycle_ovkstock_summary for each row execute function notify_audit();