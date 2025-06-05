"use client";

import { Button, Group } from "@mantine/core";
import BusinessHours from "./BusinessHours";
import { BusinessHour } from "../../prisma/generated";
import { useState } from "react";
import { CreateManyBusinessHoursInput } from "@/lib/types";
import { updateTeamBusinessHours } from "@/actions/team";
import { tryCatch } from "@/lib/try-catch";
import { showNotification } from "@mantine/notifications";

function TeamBusinessHoursForm({
  defaultBusinessHours,
}: {
  defaultBusinessHours: BusinessHour[];
}) {
  const [businessHours, setBusinessHours] =
    useState<CreateManyBusinessHoursInput>(defaultBusinessHours);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      action={async () => {
        setIsLoading(true);
        const { error } = await tryCatch(
          updateTeamBusinessHours(businessHours)
        );
        if (error) {
          showNotification({
            title: "Error",
            message: error.message,
            color: "red",
          });
        } else {
          showNotification({
            title: "Success",
            message: "Business hours updated successfully",
            color: "teal",
          });
        }
        setIsLoading(false);
      }}
    >
      <BusinessHours
        businessHours={defaultBusinessHours}
        onBusinessHoursChange={setBusinessHours}
      />
      <Group justify="flex-end">
        <Button type="submit" loading={isLoading}>
          Save
        </Button>
      </Group>
    </form>
  );
}

export default TeamBusinessHoursForm;
