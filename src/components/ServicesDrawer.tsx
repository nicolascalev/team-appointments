"use client";

import { Button, Drawer, Group, Text, Card, Stack } from "@mantine/core";
import { useState } from "react";
import { Service } from "../../prisma/generated";

interface ServicesDrawerProps {
  trigger?: React.ReactNode;
  services: Service[];
}

export default function ServicesDrawer({
  trigger,
  services,
}: ServicesDrawerProps) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpened(true)}>{trigger}</div>
      ) : (
        <Button variant="default" size="sm" onClick={() => setOpened(true)}>
          View all
        </Button>
      )}

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Services"
        size="lg"
        position="right"
      >
        <Stack>
          {services?.length === 0 && (
            <Text size="sm" c="dimmed">
              No services found
            </Text>
          )}
          {services?.map((service) => (
            <Card withBorder className="flex flex-col gap-2" key={service.id}>
              <Text fw={500}>{service.name}</Text>
              <Text size="sm" c="dimmed">
                {service.description}
              </Text>
              <Group>
                <div className="w-1/3">
                  <Text size="sm">Duration</Text>
                  <Text size="sm" c="dimmed">
                    {service.duration} minutes
                  </Text>
                </div>
                <div className="w-1/3">
                  <Text size="sm">Buffer</Text>
                  <Text size="sm" c="dimmed">
                    {service.buffer} minutes
                  </Text>
                </div>
              </Group>
              <Group>
                <div className="w-1/3">
                  <Text size="sm">Price</Text>
                  <Text size="sm" c="dimmed">
                    {service.price} {service.currencyCode?.toUpperCase()}
                  </Text>
                </div>
                <div className="w-1/3">
                  <Text size="sm">Category</Text>
                  <Text size="sm" c="dimmed">
                    {service.category}
                  </Text>
                </div>
              </Group>
              <Group>
                <div className="w-1/3">
                  <Text size="sm">Active</Text>
                  <Text size="sm" c="dimmed">
                    {service.isActive ? "Yes" : "No"}
                  </Text>
                </div>
              </Group>
            </Card>
          ))}
          <Group justify="flex-end">
            <Button
              variant="default"
              size="sm"
              onClick={() => setOpened(false)}
            >
              Close
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
