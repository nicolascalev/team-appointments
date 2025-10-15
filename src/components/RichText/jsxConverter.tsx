import React from 'react'
import { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { SerializedBlockNode, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import MediaBlock from './MediaBlock'
import LinkConverter from './LinkConverter'

export const jsxConverter: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    ...defaultConverters.blocks,
    media: ({ node }: { node: SerializedBlockNode }) => <MediaBlock node={node} />,
    mediaBlock: ({ node }: { node: SerializedBlockNode }) => <MediaBlock node={node} />,
  },
  link: ({ node, nodesToJSX }: { node: SerializedLinkNode; nodesToJSX: (args: { nodes: SerializedLinkNode['children'] }) => React.ReactNode }) => {
    const children = nodesToJSX({ nodes: node.children })
    return <LinkConverter node={node}>{children}</LinkConverter>
  },
})
