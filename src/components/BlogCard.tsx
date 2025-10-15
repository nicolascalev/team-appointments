import {
  Anchor,
  AspectRatio,
  GridCol,
  GridColProps,
  Image,
  Text,
} from "@mantine/core";
import { getCmsImageUrl } from "@/lib/utils";
import moment from "moment";
import React from "react";

type BlogCardProps = GridColProps & {
  post: {
    id: string;
    slug: string;
    title: string;
    heroImage: { url: string };
    publishedAt?: string;
    categories: { title: string }[];
  };
};

function BlogCard({ post, ...props }: BlogCardProps) {
  return (
    <GridCol span={{ base: 12, sm: 6, md: 4 }} mb="xl" {...props}>
      <Anchor
        href={`/blog/${post.slug}`}
        c="inherit"
        underline="never"
        style={{ display: "block" }}
      >
        <AspectRatio ratio={3 / 2} mx="auto">
          <Image
            src={getCmsImageUrl(post.heroImage.url)}
            alt={post.title}
            radius="md"
          />
        </AspectRatio>
        <div className="flex gap-4 my-4">
          <Text fw={500}>{post.categories[0].title ?? "Article"}</Text>
          <Text>
            {post.publishedAt
              ? moment(post.publishedAt).format("MMMM D, YYYY")
              : ""}
          </Text>
        </div>
        <Text fw={600} lineClamp={3}>
          {post.title}
        </Text>
      </Anchor>
    </GridCol>
  );
}

export default BlogCard;
