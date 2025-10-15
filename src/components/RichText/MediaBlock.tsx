import React from 'react'
import { Image, AspectRatio } from '@mantine/core'
import { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { getCmsImageUrl } from '@/lib/utils'

interface MediaBlockProps {
  node: SerializedBlockNode
}

function MediaBlock({ node }: MediaBlockProps) {
  const { fields } = node
  
  // Check if this is a media block - try different possible blockType values
  const isMediaBlock = fields?.blockType === 'media' || fields?.blockType === 'mediaBlock'
  
  if (!isMediaBlock || !fields?.media) {
    console.log('Not a media block or no media field')
    return null
  }

  const { media } = fields
  
  if (!media || typeof media !== 'object') {
    console.log('Media field is not an object:', media)
    return null
  }

  const { url, alt, width, height } = media

  if (!url) {
    console.log('No URL found in media:', media)
    return null
  }

  // Calculate aspect ratio if width and height are available
  const aspectRatio = width && height ? width / height : 16 / 9

  return (
    <AspectRatio ratio={aspectRatio} my="md">
      <Image
        src={getCmsImageUrl(url)}
        alt={alt || 'Media content'}
        radius="md"
        fit="cover"
      />
    </AspectRatio>
  )
}

export default MediaBlock