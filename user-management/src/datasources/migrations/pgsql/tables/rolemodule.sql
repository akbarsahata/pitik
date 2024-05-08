-- usermanagement.rolemodule definition

CREATE TABLE rolemodule (
	role_id uuid NOT NULL,
	module_id uuid NOT NULL,
	CONSTRAINT rolemodule_pk PRIMARY KEY (role_id, module_id)
);


-- usermanagement.rolemodule foreign keys

ALTER TABLE usermanagement.rolemodule ADD CONSTRAINT rolemodule_fk_1 FOREIGN KEY (role_id) REFERENCES "role"(id);
ALTER TABLE usermanagement.rolemodule ADD CONSTRAINT rolemodule_fk_2 FOREIGN KEY (module_id) REFERENCES "module"(id);
