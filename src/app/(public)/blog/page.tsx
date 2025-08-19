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

function BlogPage() {
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
            <Anchor href="#" c="inherit" underline="never">
              <Image src="/landing/blog-card-1.webp" alt="Blog 1" radius="md" />
              <div className="flex gap-4 my-4">
                <Text fw={500}>Insight</Text>
                <Text>August 19, 2025</Text>
              </div>
              <Title order={2} fw={500} maw={700}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Laboriosam saepe illo eaque ipsa!
              </Title>
            </Anchor>
          </GridCol>
          <GridCol span={{ base: 12, md: 4 }} mt={{ base: "xl", md: 0 }}>
            <Stack>
              <Anchor href="#" c="inherit" underline="never">
                <Group align="center" gap="sm" wrap="nowrap">
                  <AspectRatio ratio={3 / 2} className="w-1/3">
                    <Image
                      src="/landing/blog-card-2.webp"
                      alt="Blog 2"
                      radius="sm"
                    />
                  </AspectRatio>
                  <Text fw={600} size="sm" className="w-2/3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Nemo.
                  </Text>
                </Group>
              </Anchor>
              <Divider />
              <Anchor href="#" c="inherit" underline="never">
                <Group align="center" gap="sm" wrap="nowrap">
                  <AspectRatio ratio={3 / 2} className="w-1/3">
                    <Image
                      src="/landing/blog-card-2.webp"
                      alt="Blog 2"
                      radius="sm"
                    />
                  </AspectRatio>
                  <Text fw={600} size="sm" className="w-2/3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Nemo.
                  </Text>
                </Group>
              </Anchor>
              <Divider />
              <Anchor href="#" c="inherit" underline="never">
                <Group align="center" gap="sm" wrap="nowrap">
                  <AspectRatio ratio={3 / 2} className="w-1/3">
                    <Image
                      src="/landing/blog-card-2.webp"
                      alt="Blog 2"
                      radius="sm"
                    />
                  </AspectRatio>
                  <Text fw={600} size="sm" className="w-2/3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Nemo.
                  </Text>
                </Group>
              </Anchor>
              <Divider />
              <Anchor href="#" c="inherit" underline="never">
                <Group align="center" gap="sm" wrap="nowrap">
                  <AspectRatio ratio={3 / 2} className="w-1/3">
                    <Image
                      src="/landing/blog-card-2.webp"
                      alt="Blog 2"
                      radius="sm"
                    />
                  </AspectRatio>
                  <Text fw={600} size="sm" className="w-2/3">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Nemo.
                  </Text>
                </Group>
              </Anchor>
            </Stack>
          </GridCol>
        </Grid>
      </Container>
      <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
        <Title order={2} fw={500} mb="xl">
          Latest articles
        </Title>
        <Grid gutter="md">
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </Grid>
      </Container>
    </div>
  );
}

export default BlogPage;

function BlogCard() {
  return (
    <GridCol span={{ base: 12, sm: 6, md: 4 }} mb="xl">
      <Anchor href="#" c="inherit" underline="never">
        <Image src="/landing/blog-card-2.webp" alt="Blog 2" radius="md" />
        <div className="flex gap-4 my-4">
          <Text fw={500}>Insight</Text>
          <Text>August 19, 2025</Text>
        </div>
        <Text fw={600}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          saepe illo eaque ipsa!
        </Text>
      </Anchor>
    </GridCol>
  );
}
