import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Drop existing content column from timeline items
  await db.execute(sql`
    ALTER TABLE "pages_blocks_timeline_timeline" DROP COLUMN IF EXISTS "content";
    ALTER TABLE "_pages_v_blocks_timeline_timeline" DROP COLUMN IF EXISTS "content";
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Re-add content as text field
  await db.execute(sql`
    ALTER TABLE "pages_blocks_timeline_timeline" ADD COLUMN "content" varchar;
    ALTER TABLE "_pages_v_blocks_timeline_timeline" ADD COLUMN "content" varchar;
  `)
}
