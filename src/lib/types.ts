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

export type TeamMemberFull = Prisma.TeamMemberGetPayload<{
  include: {
    team: {
      include: {
        businessHours: true;
        services: true;
      };
    };
    blockOffs: true;
    services: true;
    user: true;
    availability: true;
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

export type AvailabilityInput = {
  id?: string;
  teamMemberId?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type BlockOff = {
  start: string;
  end: string;
  reason?: string;
};

export type InviteWithTeam = Prisma.InviteGetPayload<{
  include: {
    team: true;
  };
}>;

export type BookingService = Prisma.ServiceGetPayload<{
  include: {
    team: {
      include: {
        settings: true;
        businessHours: true;
        members: {
          include: {
            user: true;
            availability: true;
          };
        };
      };
    };
  };
}>;

export type AppointmentFull = Prisma.AppointmentGetPayload<{
  include: {
    team: {
      include: {
        settings: true;
      };
    };
    teamMember: {
      include: {
        user: true;
      };
    };
    service: true;
    user: true; // Client information
  };
}>;

export type EventFull = Prisma.EmployeeBlockOffGetPayload<{
  include: {
    teamMember: {
      include: {
        team: true;
        user: true;
      };
    };
  };
}>;

export type CurrentUser = Prisma.UserGetPayload<{
  include: {
    memberOf: true;
  };
}>;

// Admin Dashboard Stats Type
export type AdminDashboardStats = {
  totalAppointmentsThisMonth: number;
  todaysAppointments: number;
  upcomingAppointments: number;
  cancelledThisMonth: number;
  activeMembers: TeamMemberWithUser[];
  membersWithUpcomingAvailability: TeamMemberWithUser[];
  membersOnScheduleToday: TeamMemberWithUser[];
  staffOffWorkToday: TeamMemberWithUser[];
  allTeamMembers: TeamMemberWithUser[];
};
