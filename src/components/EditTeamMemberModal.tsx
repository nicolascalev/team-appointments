"use client";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditTeamMemberForm from "./EditTeamMemberForm";

export default function EditTeamMemberModal({ teamMemberId }: { teamMemberId: string }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant="default" onClick={open}>
        Edit
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Manage team member"
        fullScreen
      >
        <EditTeamMemberForm closeModal={close} teamMemberId={teamMemberId} />
      </Modal>
    </>
  );
}

