import React from 'react'
import { Anchor } from '@mantine/core'
import { SerializedLinkNode } from '@payloadcms/richtext-lexical'

interface LinkConverterProps {
  node: SerializedLinkNode
  children: React.ReactNode
}

function LinkConverter({ node, children }: LinkConverterProps) {
  const { fields } = node
  const { url, newTab } = fields

  if (!url) {
    return <>{children}</>
  }

  return (
    <Anchor 
      href={url} 
      target={newTab ? '_blank' : '_self'} 
      rel={newTab ? 'noopener noreferrer' : undefined}
      underline="hover"
    >
      {children}
    </Anchor>
  )
}

export default LinkConverter
