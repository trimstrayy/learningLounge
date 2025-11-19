import type { ListeningTest, ReadingTest, WritingTest, SpeakingTest } from "@/types/questions";

export async function loadQuestions(
  testType: "listening" | "reading" | "writing" | "speaking",
  testId: string
): Promise<ListeningTest | ReadingTest | WritingTest | SpeakingTest> {
  const res = await fetch(`/questions/${testType}/${testId}.json`);
  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
}
