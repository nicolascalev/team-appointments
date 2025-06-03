import { Prisma } from "../../prisma/generated";

export type TeamMemberWithUser = Prisma.TeamMemberGetPayload<{
  include: {
    user: true;
  };
}>;