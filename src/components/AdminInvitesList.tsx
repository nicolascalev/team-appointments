import { loadTeamInvites } from "@/actions/team";
import { Badge, Card, Group, Text } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import CancelInvitePopover from "./CancelInvitePopover";
import ChangeRolePopover from "./ChangeInviteRolePopover";

async function AdminInvitesList() {
  const { data: invites, error } = await loadTeamInvites();

  if (error) {
    return <div>Error loading invites: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {invites?.length === 0 && (
        <Text size="sm" c="dimmed">
          No invites found
        </Text>
      )}
      {invites?.map((invite) => (
        <Card key={invite.id} withBorder className="flex flex-col gap-2">
          <Text>{invite.user?.name ?? "User"}</Text>
          <Text size="sm" c="dimmed">
            {invite.email} has been invited as{" "}
            <Badge variant="light" radius="xs" component="span">
              {invite.role}
            </Badge>
          </Text>
          <Text size="sm" c="dimmed">
            Expires in {formatDistanceToNow(invite.expiresAt)}
          </Text>
          <Group justify="flex-end">
            <ChangeRolePopover inviteId={invite.id} currentRole={invite.role} />
            <CancelInvitePopover inviteId={invite.id} />
          </Group>
        </Card>
      ))}
    </div>
  );
}

export default AdminInvitesList;
