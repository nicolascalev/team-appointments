import { cmsFetcher } from "@/lib/fetchers";
import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teamlypro.com";
  
  // Fetch all blog posts
  const postsResponse = await cmsFetcher(`/api/posts`, {
    depth: "0",
    limit: "1000", // Adjust based on your expected number of posts
    sort: "-createdAt",
  });

  // Fetch all categories
  const categoriesResponse = await cmsFetcher(`/api/categories`, {
    depth: "0",
    limit: "1000", // Adjust based on your expected number of categories
    sort: "title",
  });

  // Fetch all teams from database
  const teams = await prisma.team.findMany({
    select: {
      slug: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Generate sitemap entries for blog posts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blogPostEntries: MetadataRoute.Sitemap = postsResponse.docs.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Generate sitemap entries for blog categories
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryEntries: MetadataRoute.Sitemap = categoriesResponse.docs.map((category: any) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date(category.updatedAt || category.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Generate sitemap entries for teams
  const teamEntries: MetadataRoute.Sitemap = teams.map((team) => ({
    url: `${baseUrl}/team/${team.slug}`,
    lastModified: team.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...staticPages, ...blogPostEntries, ...categoryEntries, ...teamEntries];
}
