import { createFileRoute } from "@tanstack/react-router";
import { FinderCardEditor } from "@/components/finder-card/FinderCardEditor";

export const Route = createFileRoute("/finder-card")({
  head: () => ({ meta: [
    { title: "Create your Finder Card — TeamFit" },
    { name: "description", content: "Add your skills, evidence and personal note to your TeamFit Finder Card." },
    { property: "og:title", content: "Create your Finder Card — TeamFit" },
    { property: "og:description", content: "Bring your skills and working style to your next student team." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: FinderCardEditor,
});