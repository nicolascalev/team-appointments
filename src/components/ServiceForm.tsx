import { TeamAdminPage, TeamService } from "@/lib/types";
import { createServiceSchema } from "@/lib/validation-schemas";
import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import MembersToggle from "./MembersToggle";
import { z } from "zod";

type ServiceFormValues = z.infer<typeof createServiceSchema>;

interface ServiceFormProps {
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  defaultValues?: Partial<TeamService>;
  team: TeamAdminPage;
  submitLabel?: string;
  loading?: boolean;
}

export default function ServiceForm({
  onSubmit,
  defaultValues,
  team,
  submitLabel = "Create",
  loading = false,
}: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    initialValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "",
      duration: defaultValues?.duration || 30,
      buffer: defaultValues?.buffer || 0,
      price: defaultValues?.price || 0,
      currencyCode: defaultValues?.currencyCode || "USD",
      isActive: defaultValues?.isActive ?? true,
      teamMembers: defaultValues?.teamMembers?.map((m) => m.id) || [],
    },
    validate: zodResolver(createServiceSchema),
  });

  const schedulableMembers = team.members.filter(
    (member) => member.isSchedulable
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Service name"
          required
          {...form.getInputProps("name")}
        />
        <Textarea
          label="Description"
          placeholder="Service description"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
        />
        <TextInput
          label="Category"
          placeholder="Service category"
          {...form.getInputProps("category")}
        />
        <NumberInput
          label="Duration (minutes)"
          placeholder="Service duration"
          required
          min={1}
          {...form.getInputProps("duration")}
        />
        <NumberInput
          label="Buffer (minutes)"
          placeholder="Service buffer"
          required
          min={0}
          {...form.getInputProps("buffer")}
        />
        <NumberInput
          label="Price"
          placeholder="Service price"
          required
          min={0}
          decimalScale={2}
          {...form.getInputProps("price")}
        />
        <Select
          label="Currency"
          placeholder="Select currency"
          data={Intl.supportedValuesOf("currency")}
          searchable
          {...form.getInputProps("currencyCode")}
        />
        <div className="flex flex-col gap-2">
          <Text size="sm" fw={500}>
            Members assigned to this service
          </Text>
          {schedulableMembers.length === 0 ? (
            <Text size="sm" c="dimmed">
              No schedulable members available
            </Text>
          ) : (
            <MembersToggle
              members={schedulableMembers}
              defaultSelectedMembers={schedulableMembers.filter((member) =>
                form.values.teamMembers.includes(member.id)
              )}
              onChange={(members) => {
                form.setFieldValue(
                  "teamMembers",
                  members.map((member) => member.id)
                );
              }}
            />
          )}
        </div>
        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 