-- Note: Constraint's names are randomly generated

-- Up
CREATE TABLE IF NOT EXISTS "b2b"."b2b_iot_device" ("id" character varying NOT NULL, "seq_no" SERIAL NOT NULL, "created_by" character varying(50) NOT NULL, "created_date" TIMESTAMP NOT NULL, "modified_by" character varying(50) NOT NULL, "modified_date" TIMESTAMP NOT NULL, "b2b_device_name" character varying NOT NULL, "ref_farm_infrastructure_id" character varying NOT NULL, "ref_device_id" character varying NOT NULL, CONSTRAINT "REL_ef56fdecfc5c9f6006d454374b" UNIQUE ("ref_device_id"), CONSTRAINT "PK_e4d97af8b86554a6827a7890874" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "b2b"."b2b_farm_infrastructure" ("id" character varying NOT NULL, "seq_no" SERIAL NOT NULL, "created_by" character varying(50) NOT NULL, "created_date" TIMESTAMP NOT NULL, "modified_by" character varying(50) NOT NULL, "modified_date" TIMESTAMP NOT NULL, "ref_organization_id" character varying NOT NULL, "ref_farm_id" character varying NOT NULL, "ref_building_id" character varying NOT NULL, "ref_coop_id" character varying NOT NULL, CONSTRAINT "PK_123e0a468389c2a65dc17c559ee" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "b2b"."b2b_farm_member" ("id" character varying NOT NULL, "seq_no" SERIAL NOT NULL, "created_by" character varying(50) NOT NULL, "created_date" TIMESTAMP NOT NULL, "modified_by" character varying(50) NOT NULL, "modified_date" TIMESTAMP NOT NULL, "ref_b2b_farm_id" character varying NOT NULL, "ref_user_id" character varying NOT NULL, CONSTRAINT "REL_a2e17f9405f0dfa9cba7968ae7" UNIQUE ("ref_user_id"), CONSTRAINT "PK_3a4039d360ee1f5fcb51e76775b" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "b2b"."b2b_farm" ("id" character varying NOT NULL, "seq_no" SERIAL NOT NULL, "created_by" character varying(50) NOT NULL, "created_date" TIMESTAMP NOT NULL, "modified_by" character varying(50) NOT NULL, "modified_date" TIMESTAMP NOT NULL, "ref_organization_id" character varying NOT NULL, "ref_farm_id" character varying NOT NULL, "ref_owner_id" character varying NOT NULL, CONSTRAINT "REL_116b1d2ce8727480c05c264b3b" UNIQUE ("ref_owner_id"), CONSTRAINT "REL_6e57e0492935412fef8303d668" UNIQUE ("ref_farm_id"), CONSTRAINT "PK_381d6b4a97b2f671f27f9baa3c8" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "b2b"."b2b_organization" ("id" character varying NOT NULL, "seq_no" SERIAL NOT NULL, "created_by" character varying(50) NOT NULL, "created_date" TIMESTAMP NOT NULL, "modified_by" character varying(50) NOT NULL, "modified_date" TIMESTAMP NOT NULL, "name" character varying(50) NOT NULL, "code" character varying(4) NOT NULL, "image" text NOT NULL, CONSTRAINT "PK_1c24502d33e5fd74ca6f91438db" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "b2b"."b2b_organization_member" ("id" character varying NOT NULL, "seq_no" SERIAL NOT NULL, "created_by" character varying(50) NOT NULL, "created_date" TIMESTAMP NOT NULL, "modified_by" character varying(50) NOT NULL, "modified_date" TIMESTAMP NOT NULL, "ref_organization_id" character varying NOT NULL, "ref_user_id" character varying NOT NULL, CONSTRAINT "REL_074a6038c9e02c4e1606889665" UNIQUE ("ref_user_id"), CONSTRAINT "PK_27f231ca28723a7df5ff7a49a7e" PRIMARY KEY ("id"));
ALTER TABLE "b2b"."b2b_iot_device" ADD CONSTRAINT "FK_ef56fdecfc5c9f6006d454374b1" FOREIGN KEY ("ref_device_id") REFERENCES "cms"."iot_device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_iot_device" ADD CONSTRAINT "FK_6bdb0c2b9835a1a596e2e925745" FOREIGN KEY ("ref_farm_infrastructure_id") REFERENCES "b2b"."b2b_farm_infrastructure"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm_infrastructure" ADD CONSTRAINT "FK_609a6bbf62ed6acc2750d9ee042" FOREIGN KEY ("ref_farm_id") REFERENCES "cms"."t_farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm_infrastructure" ADD CONSTRAINT "FK_6ebdcf577f267139c30a06da955" FOREIGN KEY ("ref_organization_id") REFERENCES "b2b"."b2b_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm_infrastructure" ADD CONSTRAINT "FK_0e1bf815915642f5ffec9d05319" FOREIGN KEY ("ref_building_id") REFERENCES "cms"."building"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm_infrastructure" ADD CONSTRAINT "FK_b1b5104e27a8026ded2da256ff1" FOREIGN KEY ("ref_coop_id") REFERENCES "cms"."t_coop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm_member" ADD CONSTRAINT "FK_67dea9e6abfb55d3833d92f014a" FOREIGN KEY ("ref_b2b_farm_id") REFERENCES "b2b"."b2b_farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm_member" ADD CONSTRAINT "FK_a2e17f9405f0dfa9cba7968ae73" FOREIGN KEY ("ref_user_id") REFERENCES "cms"."t_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm" ADD CONSTRAINT "FK_116b1d2ce8727480c05c264b3b3" FOREIGN KEY ("ref_owner_id") REFERENCES "cms"."t_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm" ADD CONSTRAINT "FK_6e57e0492935412fef8303d6684" FOREIGN KEY ("ref_farm_id") REFERENCES "cms"."t_farm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_farm" ADD CONSTRAINT "FK_f4b698e3a002ee92c842b0f9632" FOREIGN KEY ("ref_organization_id") REFERENCES "b2b"."b2b_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_organization_member" ADD CONSTRAINT "FK_713de75e9e9d67e616788f38c88" FOREIGN KEY ("ref_organization_id") REFERENCES "b2b"."b2b_organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_organization_member" ADD CONSTRAINT "FK_074a6038c9e02c4e16068896654" FOREIGN KEY ("ref_user_id") REFERENCES "cms"."t_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Down
-- ALTER TABLE "b2b"."b2b_organization_member" DROP CONSTRAINT "FK_074a6038c9e02c4e16068896654"
-- ALTER TABLE "b2b"."b2b_organization_member" DROP CONSTRAINT "FK_713de75e9e9d67e616788f38c88"
-- ALTER TABLE "b2b"."b2b_farm" DROP CONSTRAINT "FK_f4b698e3a002ee92c842b0f9632"
-- ALTER TABLE "b2b"."b2b_farm" DROP CONSTRAINT "FK_6e57e0492935412fef8303d6684"
-- ALTER TABLE "b2b"."b2b_farm" DROP CONSTRAINT "FK_116b1d2ce8727480c05c264b3b3"
-- ALTER TABLE "b2b"."b2b_farm_member" DROP CONSTRAINT "FK_a2e17f9405f0dfa9cba7968ae73"
-- ALTER TABLE "b2b"."b2b_farm_member" DROP CONSTRAINT "FK_67dea9e6abfb55d3833d92f014a"
-- ALTER TABLE "b2b"."b2b_farm_infrastructure" DROP CONSTRAINT "FK_b1b5104e27a8026ded2da256ff1"
-- ALTER TABLE "b2b"."b2b_farm_infrastructure" DROP CONSTRAINT "FK_0e1bf815915642f5ffec9d05319"
-- ALTER TABLE "b2b"."b2b_farm_infrastructure" DROP CONSTRAINT "FK_6ebdcf577f267139c30a06da955"
-- ALTER TABLE "b2b"."b2b_farm_infrastructure" DROP CONSTRAINT "FK_609a6bbf62ed6acc2750d9ee042"
-- ALTER TABLE "b2b"."b2b_iot_device" DROP CONSTRAINT "FK_6bdb0c2b9835a1a596e2e925745"
-- ALTER TABLE "b2b"."b2b_iot_device" DROP CONSTRAINT "FK_ef56fdecfc5c9f6006d454374b1"
-- DROP TABLE "b2b"."b2b_organization_member"
-- DROP TABLE "b2b"."b2b_organization"
-- DROP TABLE "b2b"."b2b_farm"
-- DROP TABLE "b2b"."b2b_farm_member"
-- DROP TABLE "b2b"."b2b_farm_infrastructure"
-- DROP TABLE "b2b"."b2b_iot_device"
