import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql`ALTER TYPE enum_pages_hero_links_link_appearance RENAME VALUE 'outline' TO 'outline-solid';`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
}
