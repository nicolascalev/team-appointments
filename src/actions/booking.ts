"use server";
import { prisma } from "@/lib/prisma";
import { tryCatch } from "@/lib/try-catch";
import { validateSlotAvailability } from "./slots";
import moment from "moment";
import { sendTransactionalEmail } from "@/lib/sendEmail";
import { AppointmentFull } from "@/lib/types";
import { TeamRole } from "../../prisma/generated";

export async function getBookingPageData(slug: string) {
  // we select the team and include the services that are active and have a member that is schedulable, active, and has a service assigned
  const { data: team, error: teamError } = await tryCatch(
    prisma.team.findUnique({
      where: {
        slug,
      },
      include: {
        members: {
          where: {
            isActive: true,
          },
          include: {
            user: true,
          },
        },
        businessHours: true,
        services: {
          where: {
            isActive: true,
            teamMembers: {
              some: {
                isSchedulable: true,
                isActive: true,
              },
            },
          },
        },
      },
    })
  );

  if (!team) {
    return { data: null, error: "Team not found" };
  }

  if (teamError) {
    return { data: null, error: "Failed to load team" };
  }

  return { data: team, error: null };
}

export async function getServiceBookingPageData(serviceId: string) {
  const { data: service, error: serviceError } = await tryCatch(
    prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        team: {
          include: {
            settings: true,
            businessHours: true,
            members: {
              where: {
                isActive: true,
                isSchedulable: true,
                services: {
                  some: {
                    id: serviceId,
                  },
                },
              },
              include: {
                user: true,
                availability: true,
              },
            },
          },
        },
      },
    })
  );

  if (!service) {
    return { data: null, error: "Service not found" };
  }

  if (serviceError) {
    return { data: null, error: "Failed to load service" };
  }

  return { data: service, error: null };
}

// TODO: double check this function and the appointment availability function because I think it's not doing the date math correctly
export async function createBooking(data: {
  name: string;
  email: string;
  serviceId: string;
  employeeIds: string[];
  timeSlot: string;
}) {
  // Get the service to get the teamId
  const { data: service, error: serviceError } = await tryCatch(
    prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { teamId: true, duration: true },
    })
  );

  if (serviceError || !service) {
    return { data: null, error: "Service not found" };
  }

  // Validate availability for each employee and find available ones
  const availableEmployees = [];

  for (const employeeId of data.employeeIds) {
    const { data: validationResult, error: validationError } =
      await validateSlotAvailability({
        teamId: service.teamId,
        serviceId: data.serviceId,
        employeeId,
        startTime: data.timeSlot,
      });

    if (!validationError && validationResult?.available) {
      availableEmployees.push(employeeId);
    }
  }

  if (availableEmployees.length === 0) {
    return {
      data: null,
      error: "No team members are available for this time slot",
    };
  }

  // Randomly select one available employee
  const selectedEmployeeId =
    availableEmployees[Math.floor(Math.random() * availableEmployees.length)];

  // Create the appointment with the selected employee
  const startTime = moment(data.timeSlot).toDate();
  const endTime = new Date(startTime.getTime() + service.duration * 60 * 1000);

  const { data: appointment, error } = await tryCatch(
    prisma.appointment.create({
      data: {
        teamId: service.teamId,
        clientName: data.name,
        clientEmail: data.email,
        serviceId: data.serviceId,
        teamMemberId: selectedEmployeeId,
        start: startTime,
        end: endTime,
      },
      include: {
        service: true,
        teamMember: {
          include: {
            user: true,
          },
        },
        user: true,
        team: true,
      },
    })
  );

  if (error) {
    return { data: null, error: "Failed to create booking" };
  }

  // notify client
  try {
    await notifyClientBooking(appointment as AppointmentFull);
  } catch (error) {
    console.error("Error sending notification to client", error);
  }

  // notify team member and admins
  try {
    await notifyTeamAdminsAndMember(appointment as AppointmentFull);
  } catch (error) {
    console.error("Error sending notifications to team", error);
  }

  return { data: appointment, error: null };
}

async function notifyClientBooking(booking: AppointmentFull) {
  const formattedDate = moment(booking.start).format("MMMM Do YYYY, h:mm a");
  const formattedEndTime = moment(booking.end).format("h:mm a");
  
  await sendTransactionalEmail(
    {
      email: booking.clientEmail,
      name: booking.clientName,
    },
    `Your booking for ${booking.service.name} has been confirmed`,
    `
      <div>
        <h2>Booking Confirmation</h2>
        <p>Thank you for booking with <strong>${booking.team.name}</strong>! Your appointment has been confirmed.</p>
        
        <h3>Appointment Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${booking.service.name}</li>
          <li><strong>Date & Time:</strong> ${formattedDate} - ${formattedEndTime}</li>
          <li><strong>Duration:</strong> ${booking.service.duration} minutes</li>
          <li><strong>Assigned to:</strong> ${booking.teamMember.user.name}</li>
          ${booking.service.price ? `<li><strong>Price:</strong> $${booking.service.price} ${booking.service.currencyCode || 'USD'}</li>` : ''}
          ${booking.notes ? `<li><strong>Notes:</strong> ${booking.notes}</li>` : ''}
        </ul>
        
        <p><strong>What's next?</strong></p>
        <ul>
          <li>Please arrive a few minutes early</li>
          <li>If you need to reschedule or cancel, please contact us as soon as possible</li>
        </ul>
        
        <p>You can view your booking details <a href="${process.env.NEXT_PUBLIC_URL}/confirmation/${booking.id}">here</a>.</p>
        
        <p>We look forward to seeing you!</p>
        <p><strong>${booking.team.name}</strong></p>
      </div>
    `,
    {
      senderName: "Teamlypro",
      senderEmail: "notifications@teamlypro.com",
    }
  );
}

async function notifyTeamAdminsAndMember(booking: AppointmentFull) {
  // Get team admins
  const { data: teamAdmins, error: adminsError } = await tryCatch(
    prisma.teamMember.findMany({
      where: {
        teamId: booking.teamId,
        role: TeamRole.ADMIN,
        isActive: true,
      },
      include: {
        user: true,
      },
    })
  );

  if (adminsError) {
    console.error("Error fetching team admins:", adminsError);
    return;
  }

  // Notify team admins
  if (teamAdmins && teamAdmins.length > 0) {
    const adminNotificationPromises = teamAdmins.map(admin => 
      notifyTeamAdmin(booking, admin.user)
    );
    await Promise.allSettled(adminNotificationPromises);
  }

  // Notify assigned team member
  if (booking.teamMember?.user) {
    await notifyTeamMember(booking, booking.teamMember.user);
  }
}

async function notifyTeamAdmin(booking: AppointmentFull, admin: { email: string; name: string | null }) {
  const formattedDate = moment(booking.start).format("MMMM Do YYYY, h:mm a");
  const formattedEndTime = moment(booking.end).format("h:mm a");
  
  await sendTransactionalEmail(
    {
      email: admin.email,
      name: admin.name || "Admin",
    },
    `New booking for ${booking.team.name}`,
    `
      <div>
        <h2>New Booking Notification</h2>
        <p>A new appointment has been booked for <strong>${booking.team.name}</strong>.</p>
        
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${booking.service.name}</li>
          <li><strong>Client:</strong> ${booking.clientName} (${booking.clientEmail})</li>
          <li><strong>Date & Time:</strong> ${formattedDate} - ${formattedEndTime}</li>
          <li><strong>Assigned to:</strong> ${booking.teamMember.user.name}</li>
          <li><strong>Duration:</strong> ${booking.service.duration} minutes</li>
          ${booking.service.price ? `<li><strong>Price:</strong> $${booking.service.price} ${booking.service.currencyCode || 'USD'}</li>` : ''}
        </ul>
        
        <p>You can manage this booking in your admin dashboard.</p>
      </div>
    `,
    {
      senderName: "Teamlypro",
      senderEmail: "notifications@teamlypro.com",
    }
  );
}

async function notifyTeamMember(booking: AppointmentFull, member: { email: string; name: string | null }) {
  const formattedDate = moment(booking.start).format("MMMM Do YYYY, h:mm a");
  const formattedEndTime = moment(booking.end).format("h:mm a");
  
  await sendTransactionalEmail(
    {
      email: member.email,
      name: member.name || "Team Member",
    },
    `New appointment assigned to you`,
    `
      <div>
        <h2>New Appointment Assignment</h2>
        <p>You have been assigned a new appointment for <strong>${booking.team.name}</strong>.</p>
        
        <h3>Appointment Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${booking.service.name}</li>
          <li><strong>Client:</strong> ${booking.clientName} (${booking.clientEmail})</li>
          <li><strong>Date & Time:</strong> ${formattedDate} - ${formattedEndTime}</li>
          <li><strong>Duration:</strong> ${booking.service.duration} minutes</li>
          ${booking.service.price ? `<li><strong>Price:</strong> $${booking.service.price} ${booking.service.currencyCode || 'USD'}</li>` : ''}
          ${booking.notes ? `<li><strong>Notes:</strong> ${booking.notes}</li>` : ''}
        </ul>
        
        <p>Please prepare for this appointment and ensure you're available at the scheduled time.</p>
      </div>
    `,
    {
      senderName: "Teamlypro",
      senderEmail: "notifications@teamlypro.com",
    }
  );
}
