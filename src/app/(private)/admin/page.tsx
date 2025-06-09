import { getUserCurrentSessionTeam } from "@/actions/team";
import TeamBusinessHoursForm from "@/components/TeamBusinessHoursForm";
import TeamForm from "@/components/TeamForm";
import TeamMemberCard from "@/components/TeamMemberCard";
import { tryCatch } from "@/lib/try-catch";
import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  NumberInput,
  Select,
  SimpleGrid,
  Text,
  Textarea,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import AdminTabs from "./AdminTabs";
import SendInviteDrawer from "@/components/SendInviteDrawer";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import AdminInvitesList from "@/components/AdminInvitesList";

async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tab = "General" } = (await searchParams) as { tab: string };

  const { data: team, error } = await tryCatch(getUserCurrentSessionTeam());

  if (error || !team) {
    redirect("/team");
  }

  return (
    <Container size="md" p={0}>
      <div>
        <Group mb="xl" mt="md">
          <Avatar color="teal" src={team.avatarUrl}>
            {team.name.slice(0, 2)}
          </Avatar>
          <Text>{team.name}</Text>
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
              <TeamForm
                mode="update"
                initialValues={{
                  name: team.name,
                  slug: team.slug,
                  category: team.category || "",
                  bio: team.bio || "",
                  location: team.location || "",
                  contactEmail: team.contactEmail || "",
                  contactPhone: team.contactPhone || "",
                  timezone: team.timezone || "",
                  avatarUrl: team.avatarUrl || "",
                }}
              />
            </div>
          </SimpleGrid>
          <Divider my="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <div>
              <Text fw={500}>Business Hours</Text>
              <Text c="dimmed">This are the business hours for the team</Text>
            </div>
            <TeamBusinessHoursForm defaultBusinessHours={team.businessHours} />
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
              {team.members.length > 0 ? (
                team.members.map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))
              ) : (
                <Text c="dimmed">No members yet</Text>
              )}
            </div>
          </SimpleGrid>
          <Divider my="xl" />
          <SimpleGrid cols={{ base: 1, sm: 2 }} id="invites">
            <div>
              <Text fw={500}>Invites</Text>
              <Text c="dimmed">Manage invites for the team</Text>
              <SendInviteDrawer
                onSuccess={async () => {
                  "use server";
                  await revalidatePath("/admin");
                }}
              />
            </div>
            <Suspense
              fallback={
                <Group justify="center">
                  <Loader size="sm" />
                  <Text>Loading invites...</Text>
                </Group>
              }
            >
              <AdminInvitesList />
            </Suspense>
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
                  { value: "days", label: "Days" },
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
