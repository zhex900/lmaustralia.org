import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_accounts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"provider" varchar NOT NULL,
  	"provider_account_id" varchar NOT NULL,
  	"type" varchar NOT NULL
  );
  
  CREATE TABLE "users_verification_tokens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"token" varchar NOT NULL,
  	"expires" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sessions" CASCADE;
  ALTER TABLE "posts_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar;
  ALTER TABLE "_posts_v_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar;
  -- ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar;
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar;
  ALTER TABLE "users" ADD COLUMN "email_verified" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "image" varchar;
  ALTER TABLE "users_accounts" ADD CONSTRAINT "users_accounts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_verification_tokens" ADD CONSTRAINT "users_verification_tokens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_accounts_order_idx" ON "users_accounts" USING btree ("_order");
  CREATE INDEX "users_accounts_parent_id_idx" ON "users_accounts" USING btree ("_parent_id");
  CREATE INDEX "users_accounts_provider_account_id_idx" ON "users_accounts" USING btree ("provider_account_id");
  CREATE INDEX "users_verification_tokens_order_idx" ON "users_verification_tokens" USING btree ("_order");
  CREATE INDEX "users_verification_tokens_parent_id_idx" ON "users_verification_tokens" USING btree ("_parent_id");
  CREATE INDEX "users_verification_tokens_token_idx" ON "users_verification_tokens" USING btree ("token");
  ALTER TABLE "users" DROP COLUMN "reset_password_token";
  ALTER TABLE "users" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "users" DROP COLUMN "salt";
  ALTER TABLE "users" DROP COLUMN "hash";
  ALTER TABLE "users" DROP COLUMN "_verified";
  ALTER TABLE "users" DROP COLUMN "_verificationtoken";
  ALTER TABLE "users" DROP COLUMN "login_attempts";
  ALTER TABLE "users" DROP COLUMN "lock_until";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "users_accounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_verification_tokens" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_accounts" CASCADE;
  DROP TABLE "users_verification_tokens" CASCADE;
  ALTER TABLE "posts_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "_posts_v_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE integer;
  ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "salt" varchar;
  ALTER TABLE "users" ADD COLUMN "hash" varchar;
  ALTER TABLE "users" ADD COLUMN "_verified" boolean;
  ALTER TABLE "users" ADD COLUMN "_verificationtoken" varchar;
  ALTER TABLE "users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  ALTER TABLE "users" DROP COLUMN "email_verified";
  ALTER TABLE "users" DROP COLUMN "image";`)
}
