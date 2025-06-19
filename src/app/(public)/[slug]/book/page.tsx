import { getServiceBookingPageData } from "@/actions/booking";
import { notFound, redirect } from "next/navigation";
import BookServiceClient from "./client";

type Params = { slug: string };
type SearchParams = { [key: string]: string | string[] | undefined };

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const { serviceId } = await searchParams;

  if (!serviceId || typeof serviceId !== "string") {
    return redirect(`/${slug}`);
  }

  const { data: service, error: serviceError } =
    await getServiceBookingPageData(serviceId);

  if (serviceError) {
    return <div>{serviceError}</div>;
  }

  if (!service) {
    return notFound();
  }

  return <BookServiceClient service={service} slug={slug} />;
}
