"use client";

import { Container, Title, Accordion } from "@mantine/core";
import React from "react";

function SectionFAQ() {
  return (
    <div className="bg-[#F6F4F1]">
      <Container size="xl" py={{ base: "4rem", sm: "6rem" }}>
        <Title order={1} fw={500} mb="2rem">
          FAQ
        </Title>
        <FAQAccordion />
      </Container>
    </div>
  );
}

export default SectionFAQ;

const data = [
  {
    value: "What is Teamlypro?",
    description:
      "Teamlypro is a scheduling application designed for studios and teams, making it easy for clients to book appointments with individual employees or the entire studio.",
  },
  {
    value: "How do I get started?",
    description:
      "Simply sign up, create your team or studio, add your services and team members, and share your booking link with clients. The onboarding process is quick and intuitive.",
  },
  {
    value: "Can I customize service durations and buffer times?",
    description:
      "Yes! You can set custom durations for each service and configure buffer times between appointments to fit your studio’s workflow.",
  },
  {
    value: "Is Teamlypro suitable for businesses with multiple employees?",
    description:
      "Absolutely. Teamlypro supports multiple employees, each with their own schedules and availability, making it perfect for teams of any size.",
  },
  {
    value: "How does Teamlypro prevent double bookings?",
    description:
      "Teamlypro uses real-time availability checks and booking rules to ensure that time slots are never double-booked, keeping your schedule accurate and up-to-date.",
  },
];

function FAQAccordion() {
  const items = data.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control px="0px">{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion
      defaultValue="Apples"
      className="home-accordion"
    >
      {items}
    </Accordion>
  );
}
