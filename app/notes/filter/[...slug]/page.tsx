import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import NotesClient from "./Notes.client";

interface FilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const currentTag = slug?.[0];
  const tagParam = currentTag === "all" || !currentTag ? undefined : currentTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tagParam],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag: tagParam }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagParam} />
    </HydrationBoundary>
  );
}
