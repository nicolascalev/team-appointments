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

export type TeamService = Prisma.ServiceGetPayload<{
  include: {
    teamMembers: {
      include: {
        user: {
          select: {
            name: true;
            avatarUrl: true;
          };
        };
      };
    };
  };
}>;

export type TeamAdminPage = Prisma.TeamGetPayload<{
  include: {
    members: {
      include: {
        user: true;
        availability: true;
        blockOffs: true;
        _count: {
          select: {
            services: true;
          };
        };
      };
    };
    services: true;
    appointments: true;
    settings: true;
    businessHours: true;
  };
}>;
