import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Migration code

  await db.execute(sql`
  

  ALTER TABLE "posts_rels" DROP CONSTRAINT IF EXISTS "posts_rels_users_fk";
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT IF EXISTS "_posts_v_rels_users_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_users_fk";
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_users_fk";
  -- ALTER TABLE "users_accounts" DROP CONSTRAINT IF EXISTS "users_accounts_parent_id_fk";
  -- ALTER TABLE "users_verification_tokens" DROP CONSTRAINT IF EXISTS "users_verification_tokens_parent_id_fk";
   ALTER TABLE "users_sessions" DROP CONSTRAINT IF EXISTS "users_sessions_parent_id_fk";

  -- Step 2: Convert users.id from integer/serial to varchar
  -- First, check if it's a serial type and drop the sequence if needed
  DO $$
  BEGIN
    -- Drop the sequence if it exists (for serial types)
    IF EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = 'users_id_seq' AND n.nspname = 'public'
    ) THEN
      DROP SEQUENCE IF EXISTS "users_id_seq" CASCADE;
    END IF;
  END $$;
  
  -- Convert users.id to varchar
  ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar USING id::text;
  
  -- Step 3: Convert all foreign key columns that reference users.id to varchar
  -- Simple conversion: NULL stays NULL, integers become text
  ALTER TABLE "posts_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar USING 
    CASE WHEN users_id IS NULL THEN NULL ELSE users_id::text END;
  
  ALTER TABLE "_posts_v_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar USING 
    CASE WHEN users_id IS NULL THEN NULL ELSE users_id::text END;
  
  ALTER TABLE "payload_locked_documents_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar USING 
    CASE WHEN users_id IS NULL THEN NULL ELSE users_id::text END;
  
  ALTER TABLE "payload_preferences_rels" ALTER COLUMN "users_id" SET DATA TYPE varchar USING 
    CASE WHEN users_id IS NULL THEN NULL ELSE users_id::text END;
  
  -- Step 3.5: Clean up empty strings and invalid references (set to NULL)
  -- Empty strings and invalid foreign keys must be NULL for constraints to work
  UPDATE "posts_rels" 
  SET "users_id" = NULL 
  WHERE ("users_id" = '' OR "users_id" NOT IN (SELECT id::text FROM "users" WHERE id IS NOT NULL));
  
  UPDATE "_posts_v_rels" 
  SET "users_id" = NULL 
  WHERE ("users_id" = '' OR "users_id" NOT IN (SELECT id::text FROM "users" WHERE id IS NOT NULL));
  
  UPDATE "payload_locked_documents_rels" 
  SET "users_id" = NULL 
  WHERE ("users_id" = '' OR "users_id" NOT IN (SELECT id::text FROM "users" WHERE id IS NOT NULL));
  
  UPDATE "payload_preferences_rels" 
  SET "users_id" = NULL 
  WHERE ("users_id" = '' OR "users_id" NOT IN (SELECT id::text FROM "users" WHERE id IS NOT NULL));
  
  -- Step 4: Recreate all foreign key constraints with varchar types
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_users_fk" 
  FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_users_fk" 
  FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" 
  FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" 
  FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  
  -- Recreate constraints for users_accounts and users_verification_tokens if they exist
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users_accounts') THEN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public'
        AND constraint_name = 'users_accounts_parent_id_fk'
      ) THEN
        ALTER TABLE "users_accounts" ADD CONSTRAINT "users_accounts_parent_id_fk" 
        FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users_verification_tokens') THEN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_schema = 'public'
        AND constraint_name = 'users_verification_tokens_parent_id_fk'
      ) THEN
        ALTER TABLE "users_verification_tokens" ADD CONSTRAINT "users_verification_tokens_parent_id_fk" 
        FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END IF;
  END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}
