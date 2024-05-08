CREATE TABLE layer.harvest_egg (
	id varchar(36) NOT NULL,
	farmingcycle_id varchar(32) NOT NULL,
	"date" date NOT NULL,
	total_quantity int NOT NULL DEFAULT 0,
	total_weight float4 NOT NULL DEFAULT 0,
	is_abnormal bool NOT NULL DEFAULT false,
	created_by varchar(32) NOT NULL,
	created_date timestamp NOT NULL DEFAULT now(),
	modified_by varchar(32) NOT NULL,
	modified_date timestamp NOT NULL DEFAULT now(),
	CONSTRAINT harvest_egg_primary UNIQUE (id),
	CONSTRAINT harvest_egg_unique UNIQUE (farmingcycle_id,"date"),
	CONSTRAINT harvest_egg_t_farmingcycle_fk FOREIGN KEY (farmingcycle_id) REFERENCES cms.t_farmingcycle(id),
	CONSTRAINT harvest_egg_t_user_fk_created_by FOREIGN KEY (created_by) REFERENCES cms.t_user(id),
	CONSTRAINT harvest_egg_t_user_fk_modified_by FOREIGN KEY (modified_by) REFERENCES cms.t_user(id)
);
