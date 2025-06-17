"use client";

import { Button, Card, Flex, Group, Select, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Service } from "../../prisma/generated";
import { useMemo, useState } from "react";

function BookingServicesList({ services }: { services: Service[] }) {
  const categories = useMemo(() => {
    const set = [
      "All",
      ...new Set(services.map((service) => service.category as string)),
    ];
    return set.filter((category) => category !== null && category !== "");
  }, [services]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories[0]
  );

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") {
      return services;
    }
    return services.filter((service) => service.category === selectedCategory);
  }, [services, selectedCategory]);

  return (
    <Flex direction="column" gap="md">
      <Text fw={500}>Services</Text>
      <Select
        data={categories}
        placeholder="Select a category"
        value={selectedCategory}
        onChange={setSelectedCategory}
        maw={300}
      />
      {filteredServices.map((service) => (
        <Card withBorder key={service.id}>
          <Flex direction="column" gap="xs">
            <Text fw={500}>
              {service.name}
              {service.category && (
                <>
                  <br />
                  <Text component="span" size="xs" c="teal">
                    {service.category}
                  </Text>
                </>
              )}
            </Text>
            <Text size="sm" c="dimmed">
              {service.description}
            </Text>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {service.price} {service.currencyCode} - {service.duration}{" "}
                minutes
              </Text>
              <Button
                variant="light"
                rightSection={<IconChevronRight size={14} />}
              >
                Book
              </Button>
            </Group>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

export default BookingServicesList;
