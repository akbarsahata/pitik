-- cms.branch_sapronak_stock definition

-- Drop table

-- DROP TABLE cms.branch_sapronak_stock;

CREATE TABLE cms.branch_sapronak_stock (
	id varchar NOT NULL,
	branch_id varchar NULL,
	category_code varchar NULL,
	category_name varchar NULL,
	subcategory_code varchar NULL,
	subcategory_name varchar NULL,
	product_code varchar NULL,
	product_name varchar NULL,
	uom varchar NULL,
	quantity float8 NULL,
	created_by varchar NULL,
	created_date timestamp NULL,
	modified_by varchar NULL,
	modified_date timestamp NULL,
	CONSTRAINT branch_sapronak_stock_pk PRIMARY KEY (id),
	CONSTRAINT branch_sapronak_stock_fk FOREIGN KEY (branch_id) REFERENCES cms.branch(id) ON DELETE SET NULL ON UPDATE SET NULL,
	CONSTRAINT branch_sapronak_stock_fk_1 FOREIGN KEY (modified_by) REFERENCES cms.t_user(id) ON DELETE SET NULL ON UPDATE SET NULL,
	CONSTRAINT branch_sapronak_stock_fk_2 FOREIGN KEY (created_by) REFERENCES cms.t_user(id) ON DELETE SET NULL ON UPDATE SET NULL
);
CREATE INDEX branch_sapronak_stock_branch_id_idx ON cms.branch_sapronak_stock USING btree (branch_id);
CREATE INDEX branch_sapronak_stock_product_code_idx ON cms.branch_sapronak_stock USING btree (product_code);

-- Table Triggers

create trigger notify_audit after
insert
    or
delete
    or
update
    on
    cms.branch_sapronak_stock for each row execute function notify_audit();