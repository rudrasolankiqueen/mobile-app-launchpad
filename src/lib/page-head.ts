export function pageHead(title: string, description: string) {
  return { meta: [
    { title: `${title} — TeamFit` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — TeamFit` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] };
}