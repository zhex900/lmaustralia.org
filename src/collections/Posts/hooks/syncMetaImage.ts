import type { CollectionBeforeChangeHook } from 'payload'

export const syncMetaImage: CollectionBeforeChangeHook = ({ data }) => {
  // Always sync meta.image with heroImage when heroImage is set
  // This ensures meta.image stays in sync whenever heroImage is updated
  if (data.heroImage) {
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
