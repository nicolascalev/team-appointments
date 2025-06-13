"use client";

import { Button, Group, Textarea } from "@mantine/core";
import { TeamMember } from "../../prisma/generated";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { updateMemberBio } from "@/actions/member";
import { memberBioSchema } from "@/lib/validation-schemas";
import { z } from "zod";

type MemberBioFormValues = z.infer<typeof memberBioSchema>;

function MemberUpdateBioForm({ member }: { member: TeamMember }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<MemberBioFormValues>({
    initialValues: {
      bio: member.bio || "",
    },
    validate: zodResolver(memberBioSchema),
  });

  // Update form values when member prop changes
  useEffect(() => {
    form.setValues({
      bio: member.bio || "",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  const handleSubmit = async (values: MemberBioFormValues) => {
    try {
      setLoading(true);
      const { error } = await updateMemberBio(member.id, values.bio || "");

      if (error) {
        throw new Error(error);
      }

      notifications.show({
        title: "Success",
        message: "Bio updated successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "Failed to update bio",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Textarea
        label="Bio"
        description="Short bio of your role in the team"
        placeholder="For example: Full-time barber, nail specialist..."
        name="bio"
        minRows={2}
        autosize
        {...form.getInputProps("bio")}
      />
      <Group justify="flex-end">
        <Button type="submit" loading={loading}>
          Save
        </Button>
      </Group>
    </form>
  );
}

export default MemberUpdateBioForm;
