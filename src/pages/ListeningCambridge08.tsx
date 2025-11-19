import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ListeningCambridge08 = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const tests = [
    {
      id: 1,
      title: "Test 1",
      sections: "4 sections",
      questions: "40 questions",
      duration: "30 minutes"
    },
    {
      id: 2,
      title: "Test 2",
      sections: "4 sections",
      questions: "40 questions",
      duration: "30 minutes"
    },
    {
      id: 3,
      title: "Test 3",
      sections: "4 sections",
      questions: "40 questions",
      duration: "30 minutes"
    },
    {
      id: 4,
      title: "Test 4",
      sections: "4 sections",
      questions: "40 questions",
      duration: "30 minutes"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-foreground">Cambridge IELTS 08</h1>
            <p className="text-lg text-muted-foreground">Listening Tests - Official Cambridge Materials</p>
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
                        <p>📁 {test.sections}</p>
                        <p>⏱️ {test.duration}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {isSelected && (
                    <div className="mt-4 p-6 border rounded-lg bg-card">
                      <h3 className="font-semibold mb-4">Test Format</h3>
                      <div className="space-y-3 text-sm text-muted-foreground mb-6">
                        <p>• <strong>Section 1:</strong> A conversation between two people in a social context</p>
                        <p>• <strong>Section 2:</strong> A monologue in a social context</p>
                        <p>• <strong>Section 3:</strong> A conversation among up to four people in an educational context</p>
                        <p>• <strong>Section 4:</strong> A monologue on an academic subject</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded mb-6">
                        <p className="text-sm"><strong>Note:</strong> You will hear each section only once. Answer all questions as you listen. 10 minutes are allowed at the end for transferring your answers to the answer sheet.</p>
                      </div>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/test/listening/cambridge-08-test-${test.id}`);
                        }}
                      >
                        Start Test {test.id}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListeningCambridge08;
