import { Card, Text, Group, Button } from "@mantine/core";
import { loadTeamServices } from "@/actions/team";

async function AdminServicesList() {
  const { data: services, error } = await loadTeamServices();

  if (error) {
    return <div>Error loading services: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
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
              <Text size="sm">Members assigned</Text>
              <Text size="sm" c="dimmed">
                {service.teamMembers.length} members
              </Text>
            </div>
            <div className="w-1/3">
              <Text size="sm">Active</Text>
              <Text size="sm" c="dimmed">
                {service.isActive ? "Yes" : "No"}
              </Text>
            </div>
          </Group>
          <Group justify="flex-end">
            <Button variant="default">Edit</Button>
          </Group>
        </Card>
      ))}
    </div>
  );
}

export default AdminServicesList;
