import BlogCard from "@/components/BlogCard";
import { cmsFetcher } from "@/lib/fetchers";
import { Container, Grid, Text, Title } from "@mantine/core";
import React from "react";

async function getLatestPosts() {
  const response = await cmsFetcher(`/api/posts`, {
    depth: "1",
    limit: "10",
    sort: "-createdAt",
  });
  return response.docs;
}

async function NotFound() {
  const latestPosts = await getLatestPosts();
  return (
    <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
      <Title order={2} fw={500}>
        Not found
      </Title>
      <Text mb="xl">
        The article you are looking for does not exist. Here are some recent
        articles you might like:
      </Text>
      <Grid gutter="md">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {latestPosts.map((post: any) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </Grid>
    </Container>
  );
}

export default NotFound;
