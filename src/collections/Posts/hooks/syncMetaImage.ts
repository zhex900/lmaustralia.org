import type { CollectionBeforeChangeHook } from 'payload'

export const syncMetaImage: CollectionBeforeChangeHook = ({ data }) => {
  // Only sync meta.image with heroImage when:
  // 1. heroImage is set
  // 2. meta.image is not already set (allows manual override)
  // This allows users to manually set SEO meta images without them being overwritten
  if (data.heroImage && !data.meta?.image) {
    const heroImageId = typeof data.heroImage === 'object' ? data.heroImage.id : data.heroImage

    return {
      ...data,
      meta: {
        ...data.meta,
        image: heroImageId,
      },
    }
  }

  return data
}
