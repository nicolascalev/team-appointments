import BlogCard from "@/components/BlogCard";
import { cmsFetcher } from "@/lib/fetchers";
import { Container, Grid, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import React from "react";

async function getPostsByCategory(slug: string) {
  const response = await cmsFetcher(`/api/posts`, {
    depth: "1",
    limit: "50",
    where: {
      'categories.slug': {
        contains: slug,
      },
    },
    sort: "-createdAt",
  });
  return response.docs;
}

async function CategoryDirectoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const categoryPosts = await getPostsByCategory(slug);
  if (categoryPosts.length === 0) {
    return notFound();
  }
  return (
    <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
      <Title order={2} fw={500} mb="xl">
        Category: <span className="capitalize">{slug}</span>
      </Title>
      <Grid gutter="md">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {categoryPosts.map((post: any) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </Grid>
    </Container>
  );
}

export default CategoryDirectoryPage;
