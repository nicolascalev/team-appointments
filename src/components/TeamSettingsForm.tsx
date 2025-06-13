"use client";
import { updateTeamSettings } from "@/actions/team";
import { teamSettingsSchema } from "@/lib/validation-schemas";
import { Button, Group, NumberInput, Select, Textarea } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface TeamSettings {
  minBookingNoticeAmount: number;
  minBookingNoticeUnit: string;
  cancellationPolicy?: string | null;
  maxAppointmentsPerDay?: number | null;
  maxAppointmentsPerEmployee?: number | null;
}

interface TeamSettingsFormProps {
  defaultValues?: TeamSettings;
  onSuccess?: () => void;
}

function TeamSettingsForm({ defaultValues, onSuccess }: TeamSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      minBookingNoticeAmount: defaultValues?.minBookingNoticeAmount || 0,
      minBookingNoticeUnit: defaultValues?.minBookingNoticeUnit || "minutes",
      cancellationPolicy: defaultValues?.cancellationPolicy || "",
      maxAppointmentsPerDay: defaultValues?.maxAppointmentsPerDay || undefined,
      maxAppointmentsPerEmployee:
        defaultValues?.maxAppointmentsPerEmployee || undefined,
    },
    validate: zodResolver(teamSettingsSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      const { error } = await updateTeamSettings({
        minBookingNoticeAmount: values.minBookingNoticeAmount,
        minBookingNoticeUnit: values.minBookingNoticeUnit,
        cancellationPolicy: values.cancellationPolicy,
        maxAppointmentsPerDay: values.maxAppointmentsPerDay,
        maxAppointmentsPerEmployee: values.maxAppointmentsPerEmployee,
      });

      if (error) {
        throw new Error(error);
      }

      notifications.show({
        title: "Success",
        message: "Team settings updated successfully",
        color: "teal",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update team settings",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="flex flex-col gap-4"
    >
      <Group wrap="nowrap">
        <NumberInput
          label="Minimum booking notice"
          placeholder="Minimum booking notice"
          name="minBookingNoticeAmount"
          className="grow"
          {...form.getInputProps("minBookingNoticeAmount")}
        />
        <Select
          label="Unit"
          placeholder="Select unit"
          data={[
            { value: "minutes", label: "Minutes" },
            { value: "hours", label: "Hours" },
            { value: "days", label: "Days" },
          ]}
          name="minBookingNoticeUnit"
          {...form.getInputProps("minBookingNoticeUnit")}
        />
      </Group>
      <Textarea
        label="Cancellation policy"
        placeholder="Cancellation policy"
        name="cancellationPolicy"
        autosize
        minRows={4}
        {...form.getInputProps("cancellationPolicy")}
      />
      <NumberInput
        label="Max appointments per day"
        placeholder="Max appointments per day"
        name="maxAppointmentsPerDay"
        {...form.getInputProps("maxAppointmentsPerDay")}
      />
      <NumberInput
        label="Max appointments per employee"
        placeholder="Max appointments per employee"
        name="maxAppointmentsPerEmployee"
        {...form.getInputProps("maxAppointmentsPerEmployee")}
      />
      <Group justify="flex-end">
        <Button type="submit" loading={loading}>
          Save
        </Button>
      </Group>
    </form>
  );
}

export default TeamSettingsForm;
