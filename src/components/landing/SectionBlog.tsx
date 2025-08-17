import {
  Button,
  Card,
  CardSection,
  Center,
  Container,
  Image,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconBook } from "@tabler/icons-react";

function SectionBlog() {
  return (
    <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs">
        <Center px="md">
          <Stack justify="center" align="center">
            <ThemeIcon size="xl">
              <IconBook />
            </ThemeIcon>
            <Title order={3} fw={500} ta="center" maw={400}>
              See the ways that Teamlypro can transform your business
            </Title>
            <Text c="dimmed" size="sm" ta="center" maw={400} mb="xl">
              News and Insights
            </Text>
          </Stack>
        </Center>
        <Card bg="#F6F4F1">
          <CardSection>
            <Image src="/landing/blog-card-1.webp" alt="Blog" />
          </CardSection>
          <Text size="lg" fw={500} mt="md">
            Alternatives to Calendly
          </Text>
          <Text c="dimmed" size="sm" lineClamp={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta,
            minus non. Accusantium earum culpa saepe natus, adipisci
            necessitatibus corrupti tenetur!
          </Text>
          <div>
            <Button size="sm" color="dark.8" mt="xl" variant="outline">
              Read more
            </Button>
          </div>
        </Card>
        <Card bg="#F6F4F1">
          <CardSection>
            <Image src="/landing/blog-card-2.webp" alt="Blog" />
          </CardSection>
          <Text size="lg" fw={500} mt="md">
            Alternatives to Cal.com
          </Text>
          <Text c="dimmed" size="sm" lineClamp={2}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta,
            minus non. Accusantium earum culpa saepe natus, adipisci
            necessitatibus corrupti tenetur!
          </Text>
          <div>
            <Button size="sm" color="dark.8" mt="xl" variant="outline">
              Read more
            </Button>
          </div>
        </Card>
      </SimpleGrid>
    </Container>
  );
}

export default SectionBlog;
