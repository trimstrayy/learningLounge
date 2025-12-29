import type { ListeningTest, ReadingTest, WritingTest, SpeakingTest } from "@/types/questions";

export async function loadQuestions(
  testType: "listening" | "reading" | "writing" | "speaking",
  testId: string
): Promise<ListeningTest | ReadingTest | WritingTest | SpeakingTest> {
  const folder = `${testType}_questions`;
  const [bookPart, testPart] = testId.split('-test');
  const book = bookPart.replace('book', '');
  const test = testPart;
  const res = await fetch(`/questions/${folder}/book${book}/test${test}.json`);
  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
}
