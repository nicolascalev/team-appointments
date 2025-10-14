import { cmsFetcher } from "@/lib/fetchers";
import { notFound } from "next/navigation";
import React from "react";

async function SingleBlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const data = await cmsFetcher(`/api/posts`, {
    depth: "1",
    where: {
      slug: {
        equals: slug,
      }
    }
  });

  if (!data.docs.length) {
    return notFound();
  }

  const post = data.docs[0];
  console.log(post);

  return <div>SingleBlogPage</div>;
}

export default SingleBlogPage;
