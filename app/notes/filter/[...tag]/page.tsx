import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "../../../../lib/api";
import NotesClient from "../Notes.client";

interface FilterPageProps {
  params: Promise<{ tag?: string[] }>;
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { tag } = await params;
  const currentTag = tag?.[0];
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
