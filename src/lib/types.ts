import { Prisma } from "../../prisma/generated";

export type TeamMemberWithUser = Prisma.TeamMemberGetPayload<{
  include: {
    user: true;
  };
}>;

export type CreateManyBusinessHoursInput = Omit<
  Prisma.BusinessHourCreateManyInput,
  "teamId"
>[];
