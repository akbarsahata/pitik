CREATE TABLE layer.product_in_harvest_egg (
	id varchar(36) NOT NULL,
	harvest_egg_id varchar(36) NOT NULL,
	product_item_id varchar(36) NOT NULL,
	quantity int NOT NULL DEFAULT 0,
	weight float4 NOT NULL DEFAULT 0,
	created_by varchar(32) NOT NULL,
	created_date timestamp NOT NULL DEFAULT now(),
	modified_by varchar(32) NOT NULL,
	modified_date timestamp NOT NULL DEFAULT now(),
	deleted_date timestamp NULL,
	CONSTRAINT product_in_harvest_egg_pk PRIMARY KEY (id),
	CONSTRAINT product_in_harvest_egg_unique_combination UNIQUE (harvest_egg_id, product_item_id)
);
ALTER TABLE layer.product_in_harvest_egg ADD CONSTRAINT product_in_harvest_egg_harvest_egg_fk FOREIGN KEY (harvest_egg_id) REFERENCES layer.harvest_egg(id);
