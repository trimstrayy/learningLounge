import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ReadingCambridge08 = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const tests = [
    {
      id: 1,
      title: "Test 1",
      passages: "3 passages",
      questions: "40 questions",
      duration: "60 minutes"
    },
    {
      id: 2,
      title: "Test 2",
      passages: "3 passages",
      questions: "40 questions",
      duration: "60 minutes"
    },
    {
      id: 3,
      title: "Test 3",
      passages: "3 passages",
      questions: "40 questions",
      duration: "60 minutes"
    },
    {
      id: 4,
      title: "Test 4",
      passages: "3 passages",
      questions: "40 questions",
      duration: "60 minutes"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-foreground">Cambridge IELTS 08</h1>
            <p className="text-lg text-muted-foreground">Reading Tests - Official Cambridge Materials</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {tests.map((test) => {
              const isSelected = selectedTest === test.id;
              return (
                <div key={test.id}>
                  <Card
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      isSelected && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedTest(isSelected ? null : test.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{test.title}</span>
                        <ChevronRight
                          className={cn(
                            "transition-transform",
                            isSelected && "rotate-90"
                          )}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>📝 {test.questions}</p>
                        <p>📁 {test.passages}</p>
                        <p>⏱️ {test.duration}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {isSelected && (
                    <div className="mt-4 p-6 border rounded-lg bg-card">
                      <h3 className="font-semibold mb-4">Test Format</h3>
                      <div className="space-y-3 text-sm text-muted-foreground mb-6">
                        <p>• <strong>Passage 1:</strong> Texts on general interest topics suitable for candidates</p>
                        <p>• <strong>Passage 2:</strong> Topics of general academic interest</p>
                        <p>• <strong>Passage 3:</strong> More complex texts on academic subjects</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded mb-6">
                        <p className="text-sm"><strong>Note:</strong> You have 60 minutes to complete all three passages. There is no extra time for transferring answers, so write your answers directly on the answer sheet.</p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/test/reading/cambridge-08-test-${test.id}`)}
                      >
                        Start {test.title}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">About Cambridge IELTS 08 Reading Tests</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>These reading tests are from the official Cambridge IELTS 08 practice materials. Each test contains three reading passages with a variety of question types.</p>
              <p><strong>Question Types Include:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Multiple choice questions</li>
                <li>True/False/Not Given statements</li>
                <li>Matching headings to paragraphs</li>
                <li>Sentence completion</li>
                <li>Summary completion</li>
                <li>Matching information</li>
              </ul>
              <p className="mt-4"><strong>Scoring:</strong> Each correct answer receives one mark. Scores out of 40 are converted to the IELTS 9-band scale.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReadingCambridge08;
