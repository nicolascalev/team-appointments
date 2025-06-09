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

export type TeamMemberCard = Prisma.TeamMemberGetPayload<{
  include: {
    user: {
      select: {
        name: true;
        avatarUrl: true;
      };
    };
    availability: true;
    blockOffs: true;
    _count: {
      select: {
        services: true;
      };
    };
  };
}>;
