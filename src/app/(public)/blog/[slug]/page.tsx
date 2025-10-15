import { cmsFetcher } from "@/lib/fetchers";
import { notFound } from "next/navigation";
import React from "react";
import {
  Container,
  Title,
  Text,
  Image,
  AspectRatio,
  Anchor,
} from "@mantine/core";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getCmsImageUrl } from "@/lib/utils";
import moment from "moment";
import { jsxConverter } from "@/components/RichText/jsxConverter";
import type { Metadata } from "next";

// Type definitions for blog post data
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content?: unknown;
  heroImage?: {
    url: string;
  };
  categories?: Array<{
    title: string;
    slug: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
  meta?: {
    description?: string;
    keywords?: string;
  };
}

// Helper function to extract text content from rich text
function extractTextFromRichText(content: unknown): string {
  if (!content) return "";

  // This is a simple implementation - you might need to adjust based on your rich text structure
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(extractTextFromRichText).join(" ");
  }
  if (content && typeof content === "object") {
    const contentObj = content as Record<string, unknown>;
    if (contentObj.text) return String(contentObj.text);
    if (contentObj.children)
      return extractTextFromRichText(contentObj.children);
  }
  return "";
}

// Helper function to create excerpt from content
function createExcerpt(content: unknown, maxLength: number = 160): string {
  const text = extractTextFromRichText(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await cmsFetcher(`/api/posts`, {
      depth: "1",
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!data.docs.length) {
      return {
        title: "Post Not Found | Teamlypro",
        description: "The requested blog post could not be found.",
      };
    }

    const post = data.docs[0] as BlogPost;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teamlypro.com";
    const postUrl = `${siteUrl}/blog/${slug}`;
    const excerpt = createExcerpt(post.content);
    const publishedDate = post.createdAt
      ? new Date(post.createdAt).toISOString()
      : undefined;
    const modifiedDate = post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : publishedDate;

    // Calculate reading time (average 200 words per minute)
    const wordCount = extractTextFromRichText(post.content).split(" ").length;
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    // Get hero image URL if available
    const heroImageUrl = post.heroImage?.url
      ? getCmsImageUrl(post.heroImage.url)
      : undefined;

    return {
      title: `${post.title} | Teamlypro Blog`,
      description: post.meta?.description || excerpt,
      keywords:
        post.meta?.keywords ||
        post.categories?.map((cat: { title: string }) => cat.title).join(", "),
      authors: [{ name: "Teamlypro Team" }],
      creator: "Teamlypro",
      publisher: "Teamlypro",
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: post.meta?.description || excerpt,
        url: postUrl,
        siteName: "Teamlypro",
        locale: "en_US",
        type: "article",
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        authors: ["Teamlypro Team"],
        section: post.categories?.[0]?.title || "Blog",
        tags: post.categories?.map((cat) => cat.title) || [],
        images: heroImageUrl
          ? [
              {
                url: heroImageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.meta?.description || excerpt,
        images: heroImageUrl ? [heroImageUrl] : [],
        creator: "@teamlypro",
        site: "@teamlypro",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
      other: {
        "article:published_time": publishedDate || "",
        "article:modified_time": modifiedDate || "",
        "article:author": "Teamlypro Team",
        "article:section": post.categories?.[0]?.title || "Blog",
        "article:tag":
          post.categories
            ?.map((cat: { title: string }) => cat.title)
            .join(",") || "",
        "twitter:label1": "Reading time",
        "twitter:data1": `${readingTimeMinutes} min read`,
        "twitter:label2": "Category",
        "twitter:data2": post.categories?.[0]?.title || "Blog",
      },
    };
  } catch (error) {
    console.error("Error generating metadata for blog post:", error);
    return {
      title: "Blog Post | Teamlypro",
      description: "Read the latest insights and updates from Teamlypro.",
    };
  }
}

async function SingleBlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const data = await cmsFetcher(`/api/posts`, {
    depth: "1",
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data.docs.length) {
    return notFound();
  }

  const post = data.docs[0];

  // Calculate reading time (average 200 words per minute)
  const wordCount = extractTextFromRichText(post.content).split(" ").length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta?.description || createExcerpt(post.content),
    image: post.heroImage?.url ? getCmsImageUrl(post.heroImage.url) : undefined,
    datePublished: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : post.createdAt
        ? new Date(post.createdAt).toISOString()
        : undefined,
    author: {
      "@type": "Organization",
      name: "Teamlypro Team",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://teamlypro.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Teamlypro",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://teamlypro.com",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://teamlypro.com"}/teamlypro-logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://teamlypro.com"}/blog/${slug}`,
    },
    articleSection: post.categories?.[0]?.title || "Blog",
    keywords:
      post.meta?.keywords ||
      post.categories?.map((cat: { title: string }) => cat.title).join(", "),
    wordCount: wordCount,
    timeRequired: `PT${readingTimeMinutes}M`,
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Container size="sm" py={{ base: "2rem", sm: "4rem" }}>
        {/* Meta Information */}
        <div className="flex gap-4 mb-4 flex-wrap">
          {post.categories?.[0] && (
            <Anchor fw={500} href={`/blog/category/${post.categories[0].slug}`}>
              {post.categories[0].title}
            </Anchor>
          )}
          {post.createdAt && (
            <Text c="dimmed">
              {moment(post.createdAt).format("MMMM D, YYYY")}
            </Text>
          )}
          <Text c="dimmed">{readingTimeMinutes} min read</Text>
        </div>
        {/* Title */}
        <Title order={1} fw={600} mb="xl">
          {post.title}
        </Title>
      </Container>

      <Container size="lg">
        {/* Hero Image */}
        {post.heroImage && (
          <AspectRatio ratio={16 / 9} mb="xl">
            <Image
              src={getCmsImageUrl(post.heroImage.url)}
              alt={post.title}
              radius="md"
            />
          </AspectRatio>
        )}
      </Container>

      <Container size="sm" py={{ base: "2rem", sm: "4rem" }}>
        {/* Rich Text Content */}
        {post.content && (
          <div className="prose prose-lg max-w-none">
            <RichText data={post.content} converters={jsxConverter} />
          </div>
        )}
      </Container>
    </>
  );
}

export default SingleBlogPage;
