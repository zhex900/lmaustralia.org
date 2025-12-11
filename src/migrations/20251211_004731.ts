import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_timeline" ADD COLUMN "content" jsonb;
  ALTER TABLE "_pages_v_blocks_timeline_timeline" ADD COLUMN "content" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_timeline" DROP COLUMN "content";
  ALTER TABLE "_pages_v_blocks_timeline_timeline" DROP COLUMN "content";`)
}
