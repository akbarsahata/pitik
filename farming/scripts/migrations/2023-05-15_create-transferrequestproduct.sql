-- cms.transferrequestproduct definition

-- Drop table

-- DROP TABLE cms.transferrequestproduct;

CREATE TABLE cms.transferrequestproduct (
	id varchar NOT NULL,
	transferrequest_id varchar(32) NOT NULL,
	category_code varchar(50) NULL,
	category_name varchar(50) NULL,
	subcategory_code varchar(50) NOT NULL,
	subcategory_name varchar(50) NULL,
	product_code varchar(50) NOT NULL,
	product_name text NULL,
	quantity int8 NULL,
	uom varchar NULL,
	CONSTRAINT transferrequestproduct_pk PRIMARY KEY (id),
	CONSTRAINT transferrequestproduct_fk FOREIGN KEY (transferrequest_id) REFERENCES cms.transferrequest(id) ON DELETE SET NULL ON UPDATE SET NULL
);
CREATE UNIQUE INDEX transferrequestproduct_id_idx ON cms.transferrequestproduct USING btree (id);
CREATE INDEX transferrequestproduct_transferrequest_id_idx ON cms.transferrequestproduct USING btree (transferrequest_id);