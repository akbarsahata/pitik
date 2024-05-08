-- Up
CREATE TABLE "b2b"."b2b_smart_scale_weighing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ref_room_id" character varying NOT NULL, "total_count" integer NOT NULL, "average_weight" numeric NOT NULL, "execution_date" TIMESTAMP NOT NULL, "start_date" TIMESTAMP NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(50) NOT NULL, "modified_by" character varying(50) NOT NULL, CONSTRAINT "PK_7125faaff17e655298352dec947" PRIMARY KEY ("id"));
CREATE TABLE "b2b"."b2b_smart_scale_weighing_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ref_weighing_id" uuid NOT NULL, "count" integer NOT NULL, "weight" numeric NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying(50) NOT NULL, "modified_by" character varying(50) NOT NULL, CONSTRAINT "PK_cc8d8bdf4b2951b1b3f3fc883d1" PRIMARY KEY ("id"));
ALTER TABLE "b2b"."b2b_smart_scale_weighing" ADD CONSTRAINT "FK_8fe6d3558fce9f8a2be2a7f79e3" FOREIGN KEY ("ref_room_id") REFERENCES "cms"."room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "b2b"."b2b_smart_scale_weighing_data" ADD CONSTRAINT "FK_f2ad265591ae882b996e11b393a" FOREIGN KEY ("ref_weighing_id") REFERENCES "b2b"."b2b_smart_scale_weighing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Down
-- ALTER TABLE "b2b"."b2b_smart_scale_weighing_data" DROP CONSTRAINT "FK_f2ad265591ae882b996e11b393a";
-- ALTER TABLE "b2b"."b2b_smart_scale_weighing" DROP CONSTRAINT "FK_8fe6d3558fce9f8a2be2a7f79e3";
-- DROP TABLE "b2b"."b2b_smart_scale_weighing_data";
-- DROP TABLE "b2b"."b2b_smart_scale_weighing";
