import { cmsFetcher } from "@/lib/fetchers";
import { getCmsImageUrl } from "@/lib/utils";
import {
  Anchor,
  AspectRatio,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import moment from "moment";

// TODO: use swr and add proper skeleton and pagination

async function getFeaturedPosts() {
  const response = await cmsFetcher(`/api/posts`, {
    depth: "1",
    limit: "6",
    // select: 'title,slug,meta,createdAt,categories',
    "where[categories][title][in]": "First Steps",
    sort: "-createdAt",
  });
  return response.docs;
}

async function getLatestPosts() {
  const response = await cmsFetcher(`/api/posts`, {
    depth: "1",
    limit: "10",
    sort: "-createdAt",
  });
  return response.docs;
}

async function BlogPage() {
  const posts = await getFeaturedPosts();
  const firstFeaturedPost = posts[0];
  const restFeaturedPosts = posts.slice(1);
  const latestPosts = await getLatestPosts();

  return (
    <div>
      <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
        <Title order={1} fw={500}>
          News & Insight
        </Title>
        <Text mb="xl">
          Read the latest product updates, company news, and industry insight.
        </Text>
        <Grid gutter="md">
          <GridCol span={{ base: 12, md: 8 }}>
            {firstFeaturedPost && (
              <Anchor
                href={`/blog/${firstFeaturedPost.slug}`}
                c="inherit"
                underline="never"
              >
                <AspectRatio ratio={3 / 2} mx="auto">
                  <Image
                    src={getCmsImageUrl(firstFeaturedPost.heroImage.url)}
                    alt="Blog 1"
                    radius="md"
                  />
                </AspectRatio>
                <div className="flex gap-4 my-4">
                  <Text fw={500}>{firstFeaturedPost.categories[0].title}</Text>
                  <Text>
                    {moment(firstFeaturedPost.createdAt).format("MMMM D, YYYY")}
                  </Text>
                </div>
                <Title order={2} fw={500} maw={700}>
                  {firstFeaturedPost.title}
                </Title>
              </Anchor>
            )}
          </GridCol>
          <GridCol span={{ base: 12, md: 4 }} mt={{ base: "xl", md: 0 }}>
            <Stack>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {restFeaturedPosts.map((post: any, index: number) => (
                <div key={post.id}>
                  <Anchor
                    href={`/blog/${post.slug}`}
                    c="inherit"
                    underline="never"
                  >
                    <Group align="center" gap="sm" wrap="nowrap">
                      <AspectRatio ratio={3 / 2} className="w-1/3">
                        <Image
                          src={getCmsImageUrl(post.heroImage.url)}
                          alt="Blog 2"
                          radius="sm"
                        />
                      </AspectRatio>
                      <Text fw={600} size="sm" className="w-2/3">
                        {post.title}
                      </Text>
                    </Group>
                  </Anchor>
                  {index < restFeaturedPosts.length - 1 && <Divider mt="md" />}
                </div>
              ))}
            </Stack>
          </GridCol>
        </Grid>
      </Container>
      <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
        <Title order={2} fw={500} mb="xl">
          Latest articles
        </Title>
        <Grid gutter="md">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {latestPosts.map((post: any) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default BlogPage;

function BlogCard({
  post,
}: {
  post: {
    id: string;
    slug: string;
    title: string;
    heroImage: { url: string };
    publishedAt?: string;
    categories: { title: string }[];
  };
}) {
  return (
    <GridCol span={{ base: 12, sm: 6, md: 4 }} mb="xl">
      <Anchor
        href={`/blog/${post.slug}`}
        c="inherit"
        underline="never"
        style={{ display: "block" }}
      >
        <AspectRatio ratio={3 / 2} mx="auto">
          <Image src={getCmsImageUrl(post.heroImage.url)} alt={post.title} radius="md" />
        </AspectRatio>
        <div className="flex gap-4 my-4">
          <Text fw={500}>{post.categories[0].title ?? "Article"}</Text>
          <Text>
            {post.publishedAt
              ? moment(post.publishedAt).format("MMMM D, YYYY")
              : ""}
          </Text>
        </div>
        <Text fw={600} lineClamp={3}>{post.title}</Text>
      </Anchor>
    </GridCol>
  );
}
