import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_nested_donut_chart_outer_radius_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" numeric,
  	"fill" varchar
  );
  
  CREATE TABLE "pages_blocks_nested_donut_chart_inner_radius_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" numeric,
  	"fill" varchar
  );
  
  CREATE TABLE "pages_blocks_nested_donut_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_nested_donut_chart_outer_radius_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" numeric,
  	"fill" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_nested_donut_chart_inner_radius_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"value" numeric,
  	"fill" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_nested_donut_chart" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_nested_donut_chart_outer_radius_data" ADD CONSTRAINT "pages_blocks_nested_donut_chart_outer_radius_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_nested_donut_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_nested_donut_chart_inner_radius_data" ADD CONSTRAINT "pages_blocks_nested_donut_chart_inner_radius_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_nested_donut_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_nested_donut_chart" ADD CONSTRAINT "pages_blocks_nested_donut_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_nested_donut_chart_outer_radius_data" ADD CONSTRAINT "_pages_v_blocks_nested_donut_chart_outer_radius_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_nested_donut_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_nested_donut_chart_inner_radius_data" ADD CONSTRAINT "_pages_v_blocks_nested_donut_chart_inner_radius_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_nested_donut_chart"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_nested_donut_chart" ADD CONSTRAINT "_pages_v_blocks_nested_donut_chart_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_nested_donut_chart_outer_radius_data_order_idx" ON "pages_blocks_nested_donut_chart_outer_radius_data" USING btree ("_order");
  CREATE INDEX "pages_blocks_nested_donut_chart_outer_radius_data_parent_id_idx" ON "pages_blocks_nested_donut_chart_outer_radius_data" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_nested_donut_chart_inner_radius_data_order_idx" ON "pages_blocks_nested_donut_chart_inner_radius_data" USING btree ("_order");
  CREATE INDEX "pages_blocks_nested_donut_chart_inner_radius_data_parent_id_idx" ON "pages_blocks_nested_donut_chart_inner_radius_data" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_nested_donut_chart_order_idx" ON "pages_blocks_nested_donut_chart" USING btree ("_order");
  CREATE INDEX "pages_blocks_nested_donut_chart_parent_id_idx" ON "pages_blocks_nested_donut_chart" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_nested_donut_chart_path_idx" ON "pages_blocks_nested_donut_chart" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_nested_donut_chart_outer_radius_data_order_idx" ON "_pages_v_blocks_nested_donut_chart_outer_radius_data" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_nested_donut_chart_outer_radius_data_parent_id_idx" ON "_pages_v_blocks_nested_donut_chart_outer_radius_data" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_nested_donut_chart_inner_radius_data_order_idx" ON "_pages_v_blocks_nested_donut_chart_inner_radius_data" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_nested_donut_chart_inner_radius_data_parent_id_idx" ON "_pages_v_blocks_nested_donut_chart_inner_radius_data" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_nested_donut_chart_order_idx" ON "_pages_v_blocks_nested_donut_chart" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_nested_donut_chart_parent_id_idx" ON "_pages_v_blocks_nested_donut_chart" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_nested_donut_chart_path_idx" ON "_pages_v_blocks_nested_donut_chart" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_nested_donut_chart_outer_radius_data" CASCADE;
  DROP TABLE "pages_blocks_nested_donut_chart_inner_radius_data" CASCADE;
  DROP TABLE "pages_blocks_nested_donut_chart" CASCADE;
  DROP TABLE "_pages_v_blocks_nested_donut_chart_outer_radius_data" CASCADE;
  DROP TABLE "_pages_v_blocks_nested_donut_chart_inner_radius_data" CASCADE;
  DROP TABLE "_pages_v_blocks_nested_donut_chart" CASCADE;`)
}
