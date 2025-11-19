import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WritingCambridge08 = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  const tests = [
    {
      id: 1,
      title: "Test 1",
      tasks: "2 tasks",
      task1Type: "Graph/Chart",
      duration: "60 minutes"
    },
    {
      id: 2,
      title: "Test 2",
      tasks: "2 tasks",
      task1Type: "Graph/Chart",
      duration: "60 minutes"
    },
    {
      id: 3,
      title: "Test 3",
      tasks: "2 tasks",
      task1Type: "Graph/Chart",
      duration: "60 minutes"
    },
    {
      id: 4,
      title: "Test 4",
      tasks: "2 tasks",
      task1Type: "Graph/Chart",
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
            <p className="text-lg text-muted-foreground">Writing Tests - Official Cambridge Materials</p>
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
                        <p>📝 {test.tasks}</p>
                        <p>📊 Task 1: {test.task1Type}</p>
                        <p>⏱️ {test.duration}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {isSelected && (
                    <div className="mt-4 p-6 border rounded-lg bg-card">
                      <h3 className="font-semibold mb-4">Test Format</h3>
                      <div className="space-y-3 text-sm text-muted-foreground mb-6">
                        <p>• <strong>Task 1 (20 minutes):</strong> Describe, summarize or explain visual information (graph, table, chart, diagram). Minimum 150 words.</p>
                        <p>• <strong>Task 2 (40 minutes):</strong> Write an essay in response to a point of view, argument or problem. Minimum 250 words.</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded mb-6">
                        <p className="text-sm"><strong>Note:</strong> Task 2 contributes twice as much as Task 1 to the Writing score. You must complete both tasks to receive a band score.</p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/test/writing/cambridge-08-test-${test.id}`)}
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
            <h2 className="text-xl font-semibold mb-4">About Cambridge IELTS 08 Writing Tests</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>These writing tests are from the official Cambridge IELTS 08 practice materials. Each test contains two writing tasks that assess your ability to write academic English.</p>
              <p><strong>Assessment Criteria:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Task Achievement/Response:</strong> How well you answer the question</li>
                <li><strong>Coherence and Cohesion:</strong> How well organized your writing is</li>
                <li><strong>Lexical Resource:</strong> Range and accuracy of vocabulary</li>
                <li><strong>Grammatical Range and Accuracy:</strong> Variety and correctness of grammar</li>
              </ul>
              <p className="mt-4"><strong>Tips:</strong> Spend about 20 minutes on Task 1 and 40 minutes on Task 2. Make sure you write at least the minimum number of words for each task.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WritingCambridge08;
