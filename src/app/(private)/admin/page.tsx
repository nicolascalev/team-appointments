import BusinessHours from "@/components/BusinessHours";
import LabelWithInfo from "@/components/LabelWithInfo";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import AdminTabs from "./AdminTabs";
import { IconChevronRight } from "@tabler/icons-react";

async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tab = "General" } = (await searchParams) as { tab: string };

  return (
    <Container size="md">
      <div>
        <Text fw={500} mt="xl" size="lg">
          Admin
        </Text>
        <Group mb="xl" mt="md">
          <Avatar color="teal">TA</Avatar>
          <Text>Team Alpha</Text>
        </Group>
      </div>
      <AdminTabs activeTab={tab} />
      {tab === "General" && (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2 }} pt="md">
            <div>
              <Text fw={500}>Active team</Text>
              <Text c="dimmed">Select the team you want to see</Text>
            </div>
            <div className="flex flex-col gap-4">
              <form className="flex flex-col gap-4">
                <TextInput
                  label="Team Name"
                  placeholder="Team Name"
                  name="teamName"
                />
                <TextInput
                  label="Slug"
                  description="This is the appointment booking page url"
                  placeholder="slug"
                  name="teamSlug"
                />
                <TextInput
                  label="Location"
                  placeholder="Location"
                  name="location"
                />
                <TextInput
                  label="Contact Email"
                  placeholder="Contact Email"
                  name="contactEmail"
                  type="email"
                />
                <TextInput
                  label="Contact Phone"
                  placeholder="Contact Phone"
                  name="contactPhone"
                  type="tel"
                />
                <TextInput
                  label="Timezone"
                  placeholder="Timezone"
                  name="timezone"
                  type="text"
                />
                <Group justify="flex-end">
                  <Button type="submit">Save</Button>
                </Group>
              </form>
            </div>
          </SimpleGrid>
          <Divider my="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <div>
              <Text fw={500}>Business Hours</Text>
              <Text c="dimmed">This are the business hours for the team</Text>
            </div>
            <form className="flex flex-col gap-4">
              <BusinessHours businessHours={[]} />
              <Group justify="flex-end">
                <Button type="submit">Save</Button>
              </Group>
            </form>
          </SimpleGrid>
        </>
      )}
      {tab === "Members" && (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2 }} pt="md">
            <div>
              <Text fw={500}>Members</Text>
              <Text c="dimmed">Manage people in the team</Text>
              <Button
                variant="default"
                mt="md"
                rightSection={<IconChevronRight size={14} />}
                component="a"
                href="#invites"
              >
                Invites
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <Card withBorder>
                <Group justify="space-between">
                  <div>
                    <Text>Roberto Valverde</Text>
                    <Text c="dimmed">Full-time barber</Text>
                  </div>
                  <Avatar>R</Avatar>
                </Group>
                <Group mt="md" wrap="nowrap">
                  <div className="w-1/3">
                    <LabelWithInfo
                      label="Active"
                      info="You can use this to quickly disable a user from taking appointments"
                    />
                    <Text size="sm" c="dimmed">
                      Yes
                    </Text>
                  </div>
                  <div className="w-1/3">
                    <LabelWithInfo
                      label="Schedulable"
                      info="Schedulable means that the user is an employee available to take appointments, not just a team member"
                    />
                    <Text size="sm" c="dimmed">
                      Yes
                    </Text>
                  </div>
                </Group>
                <Box mt="md">
                  <Text size="sm" fw={500}>
                    Schedule
                  </Text>
                  <Text size="sm" c="dimmed">
                    Monday: 10:00 - 18:00
                  </Text>
                  <Text size="sm" c="dimmed">
                    Tuesday: 10:00 - 18:00
                  </Text>
                  <Text size="sm" c="dimmed">
                    Wednesday: 10:00 - 18:00
                  </Text>
                </Box>
                <Box mt="md">
                  <LabelWithInfo
                    label="Block offs"
                    info="Upcoming blocks of time off for the employee"
                  />
                  <Text size="sm" c="dimmed">
                    February 10th, 2025: 10:00 - 18:00
                  </Text>
                </Box>
                <Box mt="md">
                  <Text size="sm" fw={500}>
                    Assigned services
                  </Text>
                  <Text size="sm" c="dimmed">
                    5 services assigned
                  </Text>
                </Box>
                <Group justify="flex-end" mt="md">
                  <Button variant="default">Edit</Button>
                </Group>
              </Card>
            </div>
          </SimpleGrid>
          <Divider my="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2 }} id="invites">
            <div>
              <Text fw={500}>Invites</Text>
              <Text c="dimmed">Manage invites for the team</Text>
              <Button
                variant="default"
                mt="md"
                rightSection={<IconChevronRight size={14} />}
              >
                Send invite
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <Card withBorder className="flex flex-col gap-2">
                <Text>User</Text>
                <Text size="sm" c="dimmed">
                  text@example.com has been invited as an admin
                </Text>
                <Text size="sm" c="dimmed">
                  Expires in 1 day
                </Text>
                <Group justify="flex-end" mt="md">
                  <Button variant="default">Cancel</Button>
                </Group>
              </Card>
            </div>
          </SimpleGrid>
        </>
      )}
      {tab === "Services" && (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2 }} pt="md">
            <div>
              <Text fw={500}>Services</Text>
              <Text c="dimmed">Manage services available for the team</Text>
              <Button
                variant="default"
                mt="md"
                rightSection={<IconChevronRight size={14} />}
              >
                Add service
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              <Card withBorder className="flex flex-col gap-2">
                <Text fw={500}>Haircut</Text>
                <Text size="sm" c="dimmed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Possimus, tempore.
                </Text>
                <Group>
                  <div className="w-1/3">
                    <Text size="sm">Duration</Text>
                    <Text size="sm" c="dimmed">
                      30 minutes
                    </Text>
                  </div>
                  <div className="w-1/3">
                    <Text size="sm">Buffer</Text>
                    <Text size="sm" c="dimmed">
                      10 minutes
                    </Text>
                  </div>
                </Group>
                <Group>
                  <div className="w-1/3">
                    <Text size="sm">Price</Text>
                    <Text size="sm" c="dimmed">
                      10 USD
                    </Text>
                  </div>
                  <div className="w-1/3">
                    <Text size="sm">Category</Text>
                    <Text size="sm" c="dimmed">
                      Essentials
                    </Text>
                  </div>
                </Group>
                <Group>
                  <div className="w-1/3">
                    <Text size="sm">Members assigned</Text>
                    <Text size="sm" c="dimmed">
                      10 members
                    </Text>
                  </div>
                </Group>
                <Group justify="flex-end">
                  <Button variant="default">Edit</Button>
                </Group>
              </Card>
            </div>
          </SimpleGrid>
        </>
      )}
      {tab === "Settings" && (
        <SimpleGrid cols={{ base: 1, sm: 2 }} pt="md">
          <div>
            <Text fw={500}>Settings</Text>
            <Text c="dimmed">Manage settings for the team</Text>
          </div>
          <form className="flex flex-col gap-4">
            <Group wrap="nowrap">
              <NumberInput
                label="Minimum booking notice"
                placeholder="Minimum booking notice"
                name="minBookingNotice"
                className="grow"
              />
              <Select
                label="Unit"
                placeholder="Select unit"
                defaultValue="minutes"
                data={[
                  { value: "minutes", label: "Minutes" },
                  { value: "hours", label: "Hours" },
                  { value: "days", label: "Days" }
                ]}
                name="minBookingNoticeUnit"
              />
            </Group>
            <Textarea
              label="Cancellation policy"
              placeholder="Cancellation policy"
              name="cancellationPolicy"
              autosize
              minRows={4}
            />
            <NumberInput
              label="Max appointments per day"
              placeholder="Max appointments per day"
              name="maxAppointmentsPerDay"
            />
            <NumberInput
              label="Max appointments per employee"
              placeholder="Max appointments per employee"
              name="maxAppointmentsPerEmployee"
            />
            <Group justify="flex-end">
              <Button type="submit">Save</Button>
            </Group>
          </form>
        </SimpleGrid>
      )}
    </Container>
  );
}

export default AdminPage;
