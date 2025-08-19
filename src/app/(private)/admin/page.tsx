import { getUserCurrentSessionTeam } from "@/actions/team";
import AdminInvitesList from "@/components/AdminInvitesList";
import AdminServicesList from "@/components/AdminServicesList";
import CreateServiceDrawer from "@/components/CreateServiceDrawer";
import SendInviteDrawer from "@/components/SendInviteDrawer";
import TeamBusinessHoursForm from "@/components/TeamBusinessHoursForm";
import TeamForm from "@/components/TeamForm";
import TeamMemberCard from "@/components/TeamMemberCard";
import TeamSettingsForm from "@/components/TeamSettingsForm";
import { tryCatch } from "@/lib/try-catch";
import {
  Avatar,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { IconArrowUpRight, IconChevronRight } from "@tabler/icons-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminTabs from "./AdminTabs";

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
        <Group mb="xl" mt="md" align="flex-start">
          <Avatar color="indigo" src={team.avatarUrl}>
            {team.name.slice(0, 2)}
          </Avatar>
          <div>
            <Text>{team.name}</Text>
            <Button
              mt="xs"
              variant="light"
              size="xs"
              rightSection={<IconArrowUpRight size={14} />}
              component="a"
              href={`/${team.slug}`}
              target="_blank"
            >
              Booking page
            </Button>
          </div>
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
              <CreateServiceDrawer team={team} />
            </div>
            <Suspense
              fallback={
                <Group justify="center">
                  <Loader size="sm" />
                  <Text>Loading services...</Text>
                </Group>
              }
            >
              <AdminServicesList team={team} />
            </Suspense>
          </SimpleGrid>
        </>
      )}
      {tab === "Settings" && (
        <SimpleGrid cols={{ base: 1, sm: 2 }} pt="md">
          <div>
            <Text fw={500}>Settings</Text>
            <Text c="dimmed">Manage settings for the team</Text>
          </div>
          <TeamSettingsForm
            defaultValues={{
              minBookingNoticeAmount:
                team.settings?.minBookingNoticeAmount || 0,
              minBookingNoticeUnit:
                team.settings?.minBookingNoticeUnit || "minutes",
              cancellationPolicy: team.settings?.cancellationPolicy || "",
              maxAppointmentsPerDay:
                team.settings?.maxAppointmentsPerDay || undefined,
              maxAppointmentsPerEmployee:
                team.settings?.maxAppointmentsPerEmployee || undefined,
            }}
          />
        </SimpleGrid>
      )}
    </Container>
  );
}

export default AdminPage;
