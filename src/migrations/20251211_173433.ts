import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql`ALTER TYPE enum_pages_blocks_content_columns_link_appearance RENAME VALUE 'outline' TO 'outline-solid';`,
  )
  await db.execute(
    sql`ALTER TYPE enum__pages_v_blocks_content_columns_link_appearance RENAME VALUE 'outline' TO 'outline-solid';`,
  )
  await db.execute(
    sql`ALTER TYPE enum_pages_blocks_cta_links_link_appearance RENAME VALUE 'outline' TO 'outline-solid';`,
  )
  await db.execute(
    sql`ALTER TYPE enum__pages_v_blocks_cta_links_link_appearance RENAME VALUE 'outline' TO 'outline-solid';`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql`ALTER TYPE enum_pages_blocks_content_columns_link_appearance RENAME VALUE 'outline-solid' TO 'outline';`,
  )
  await db.execute(
    sql`ALTER TYPE enum__pages_v_blocks_content_columns_link_appearance RENAME VALUE 'outline-solid' TO 'outline';`,
  )
  await db.execute(
    sql`ALTER TYPE enum_pages_blocks_cta_links_link_appearance RENAME VALUE 'outline-solid' TO 'outline';`,
  )
  await db.execute(
    sql`ALTER TYPE enum__pages_v_blocks_cta_links_link_appearance RENAME VALUE 'outline-solid' TO 'outline';`,
  )
}
