import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import TestHeader from "@/components/TestHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTestSession } from "@/hooks/useTestSession";
import { loadQuestions } from "@/utils/loadQuestions";
import type { WritingTest as WritingTestData } from "@/types/questions";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";

type UploadTask = 1 | 2;

const countWords = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const WritingTest = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { toast } = useToast();
  const durationMinutes = 60;

  const [task1Answer, setTask1Answer] = useState("");
  const [task2Answer, setTask2Answer] = useState("");
  const [task1ImageData, setTask1ImageData] = useState<string | null>(null);
  const [task2ImageData, setTask2ImageData] = useState<string | null>(null);
  const [test, setTest] = useState<WritingTestData | null>(null);
  const [loadingTest, setLoadingTest] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<1 | 2>(1);

  const clearStoredDrafts = useCallback(() => {
    try {
      localStorage.removeItem("writing:task1:answer");
      localStorage.removeItem("writing:task2:answer");
      localStorage.removeItem("writing:task1:image");
      localStorage.removeItem("writing:task2:image");
    } catch (error) {
      console.warn("Failed to clear writing draft", error);
    }
  }, []);

  const resetLocalState = useCallback(() => {
    setTask1Answer("");
    setTask2Answer("");
    setTask1ImageData(null);
    setTask2ImageData(null);
    setSubmitted(false);
    setShowResultsModal(false);
    setCurrentTask(1);
  }, []);

  const session = useTestSession(durationMinutes, {
    onConfirmExit: () => {
      resetLocalState();
      clearStoredDrafts();
      navigate("/mock-tests");
    },
  });

  useEffect(() => {
    setLoadingTest(true);
    loadQuestions("writing", testId!)
      .then((data) => setTest(data as WritingTestData))
      .catch((error) => {
        console.error("Failed to load writing test", error);
        toast({
          title: "Sample test loaded",
          description: "We could not load the official writing task. A sample prompt is shown instead.",
        });
        setTest(null);
      })
      .finally(() => setLoadingTest(false));
  }, [toast, testId]);

  useEffect(() => {
    try {
      const storedTask1 = localStorage.getItem("writing:task1:answer");
      const storedTask2 = localStorage.getItem("writing:task2:answer");
      const storedImage1 = localStorage.getItem("writing:task1:image");
      const storedImage2 = localStorage.getItem("writing:task2:image");

      if (storedTask1) setTask1Answer(storedTask1);
      if (storedTask2) setTask2Answer(storedTask2);
      if (storedImage1) setTask1ImageData(storedImage1);
      if (storedImage2) setTask2ImageData(storedImage2);
    } catch (error) {
      console.warn("Failed to load saved writing drafts", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("writing:task1:answer", task1Answer);
    } catch (error) {
      console.warn("Failed to persist task1 answer", error);
    }
  }, [task1Answer]);

  useEffect(() => {
    try {
      localStorage.setItem("writing:task2:answer", task2Answer);
    } catch (error) {
      console.warn("Failed to persist task2 answer", error);
    }
  }, [task2Answer]);

  useEffect(() => {
    try {
      if (task1ImageData) {
        localStorage.setItem("writing:task1:image", task1ImageData);
      } else {
        localStorage.removeItem("writing:task1:image");
      }
    } catch (error) {
      console.warn("Failed to persist task1 image", error);
    }
  }, [task1ImageData]);

  useEffect(() => {
    try {
      if (task2ImageData) {
        localStorage.setItem("writing:task2:image", task2ImageData);
      } else {
        localStorage.removeItem("writing:task2:image");
      }
    } catch (error) {
      console.warn("Failed to persist task2 image", error);
    }
  }, [task2ImageData]);

  const task1WordCount = useMemo(() => countWords(task1Answer), [task1Answer]);
  const task2WordCount = useMemo(() => countWords(task2Answer), [task2Answer]);
  const uploadsAttached = Boolean(task1ImageData || task2ImageData);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, task: UploadTask) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;

      if (task === 1) {
        setTask1ImageData(dataUrl);
      } else {
        setTask2ImageData(dataUrl);
      }

      toast({
        title: "Image uploaded",
        description: "Your handwritten response has been attached.",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!task1Answer && !task2Answer && !task1ImageData && !task2ImageData) {
      toast({
        title: "No answer provided",
        description: "Type a response or upload a handwritten answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      testId: test?.testId ?? "writing-sample-1",
      submittedAt: new Date().toISOString(),
      answers: {
        task1: task1Answer,
        task2: task2Answer,
        task1Image: task1ImageData,
        task2Image: task2ImageData,
      },
      wordCounts: { task1: task1WordCount, task2: task2WordCount },
    };

    console.log("Writing test submission", payload);
    toast({
      title: "Submission ready",
      description: "Review your answers or return to the dashboard.",
    });

    setSubmitted(true);
    setShowResultsModal(true);
  };

  const handleRedoTest = () => {
    resetLocalState();
    clearStoredDrafts();
    session.setStarted(false);
    session.setTimeLeft(durationMinutes * 60);
  };

  const handleExitToMockTests = () => {
    resetLocalState();
    clearStoredDrafts();
    session.setStarted(false);
    session.setTimeLeft(durationMinutes * 60);
    navigate("/mock-tests");
  };

  const handleNextTask = () => {
    if (currentTask === 1) {
      setCurrentTask(2);
    }
  };

  const handlePreviousTask = () => {
    if (currentTask === 2) {
      setCurrentTask(1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TestHeader title={test?.testId ? `IELTS Writing — ${test.testId}` : "IELTS Writing Test"} session={session} />
      <main className="pt-32 sm:pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {loadingTest && <div className="text-center">Loading writing tasks...</div>}

          {!loadingTest && !test && (
            <Card className="p-6 bg-muted/30 text-center">
              <h2 className="text-xl font-semibold mb-2">Sample tasks coming soon</h2>
              <p className="text-sm text-muted-foreground">Official writing prompts are being prepared. Practise using the generic template below.</p>
            </Card>
          )}

          {test && !session.started && (
            <Card className="p-8 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">IELTS Academic Writing</h2>
              <p className="text-muted-foreground mb-6">
                You have {durationMinutes} minutes to complete both Task 1 and Task 2. Task 1 requires at least 150 words and Task 2 requires at least 250 words.
              </p>
              <div className="text-left text-sm text-muted-foreground space-y-2 mb-6">
                <p>• Task 1: summarise and compare the visual information provided.</p>
                <p>• Task 2: write an essay responding to the question or statement.</p>
                <p>• Type in the editor or upload a photo of your handwritten response.</p>
              </div>
              <Button size="lg" onClick={() => session.setStarted(true)}>Begin Test</Button>
            </Card>
          )}

          {test && session.started && (
            <div className="space-y-6">
              <AlertDialog open={showResultsModal} onOpenChange={setShowResultsModal}>
                <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-center">Submission Ready</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <div className="text-2xl font-semibold text-primary">{task1WordCount}</div>
                            <div className="text-sm text-muted-foreground mt-1">Task 1 Words</div>
                          </div>
                          <div className="text-center p-4 bg-primary/5 rounded-lg">
                            <div className="text-2xl font-semibold text-primary">{task2WordCount}</div>
                            <div className="text-sm text-muted-foreground mt-1">Task 2 Words</div>
                          </div>
                          <div className="text-center p-4 bg-secondary/30 rounded-lg">
                            <div className="text-2xl font-semibold text-card-foreground">{uploadsAttached ? "Yes" : "No"}</div>
                            <div className="text-sm text-muted-foreground mt-1">Handwritten Uploads</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground text-center">
                          Restart the writing test or return to the mock tests dashboard when you are ready.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button variant="secondary" onClick={handleRedoTest}>
                            Redo This Test
                          </Button>
                          <Button onClick={handleExitToMockTests}>
                            Back to Mock Tests
                          </Button>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setShowResultsModal(false)} className="w-full">
                          Continue Editing
                        </Button>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>

              <Card className="p-6 border-border bg-secondary/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h2 className="font-semibold text-card-foreground mb-2">Test Instructions</h2>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Complete both tasks within {durationMinutes} minutes.</li>
                      <li>• You may type your responses or upload handwritten photos.</li>
                      <li>• Suggested timing: Task 1 — 20 minutes, Task 2 — 40 minutes.</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {currentTask === 1 && (
                <>
                  <Card className="p-6 border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-bold text-primary">Task 1</h2>
                      <span className="text-sm text-muted-foreground">Minimum {test.writing[0].minWords} words • {test.writing[0].suggestedTime}</span>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-card-foreground leading-relaxed mb-3">
                        <strong>Instruction:</strong> {test.writing[0].instruction}
                      </p>
                      <p className="text-card-foreground leading-relaxed">
                        <strong>Task:</strong> {test.writing[0].prompt}
                      </p>
                      {test.writing[0].imageUrl ? (
                        <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                          <img src={test.writing[0].imageUrl} alt="Task 1 visual" className="mx-auto max-w-full" />
                        </div>
                      ) : (
                        <div className="mt-4 p-8 bg-muted rounded-lg text-center">
                          <p className="text-muted-foreground italic">[No image provided for this task]</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 border-border">
                    <h3 className="text-xl font-semibold text-card-foreground mb-4">Task 1 Answer</h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-card-foreground mb-2">Type your answer</label>
                      <Textarea
                        value={task1Answer}
                        onChange={(event) => setTask1Answer(event.target.value)}
                        placeholder="Type your Task 1 answer here (minimum 150 words)"
                        className="min-h-[200px] font-mono text-base"
                      />
                      <p className="text-sm text-muted-foreground mt-2">Word count: {task1WordCount}</p>

                      <label className="block text-sm font-medium text-card-foreground mb-2 mt-4">Or upload a photo of your handwritten answer</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, 1)} className="hidden" id="image-upload-1" />
                        <label htmlFor="image-upload-1" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-2">{task1ImageData ? "Image uploaded" : "Click to upload image for Task 1"}</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                        </label>
                        {task1ImageData && (
                          <div className="mt-4">
                            <img src={task1ImageData} alt="Task 1 upload" className="mx-auto max-w-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button variant="outline" onClick={handleExitToMockTests}>
                      Exit Test
                    </Button>
                    <Button size="lg" onClick={handleNextTask} className="sm:w-auto">
                      Next Task
                    </Button>
                  </div>
                </>
              )}

              {currentTask === 2 && (
                <>
                  <Card className="p-6 border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-bold text-primary">Task 2</h2>
                      <span className="text-sm text-muted-foreground">Minimum {test.writing[1].minWords} words • {test.writing[1].suggestedTime}</span>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-card-foreground leading-relaxed mb-3">
                        <strong>Instruction:</strong> {test.writing[1].instruction}
                      </p>
                      <p className="text-card-foreground leading-relaxed">
                        <strong>Task:</strong> {test.writing[1].prompt}
                      </p>
                      {test.writing[1].imageUrl ? (
                        <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                          <img src={test.writing[1].imageUrl} alt="Task 2 visual" className="mx-auto max-w-full" />
                        </div>
                      ) : (
                        <div className="mt-4 p-8 bg-muted rounded-lg text-center">
                          <p className="text-muted-foreground italic">[No image provided for this task]</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 border-border">
                    <h3 className="text-xl font-semibold text-card-foreground mb-4">Task 2 Answer</h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-card-foreground mb-2">Type your answer</label>
                      <Textarea
                        value={task2Answer}
                        onChange={(event) => setTask2Answer(event.target.value)}
                        placeholder="Type your Task 2 answer here (minimum 250 words)"
                        className="min-h-[200px] font-mono text-base"
                      />
                      <p className="text-sm text-muted-foreground mt-2">Word count: {task2WordCount}</p>

                      <label className="block text-sm font-medium text-card-foreground mb-2 mt-4">Or upload a photo of your handwritten answer</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input type="file" accept="image/*" onChange={(event) => handleImageUpload(event, 2)} className="hidden" id="image-upload-2" />
                        <label htmlFor="image-upload-2" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-2">{task2ImageData ? "Image uploaded" : "Click to upload image for Task 2"}</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                        </label>
                        {task2ImageData && (
                          <div className="mt-4">
                            <img src={task2ImageData} alt="Task 2 upload" className="mx-auto max-w-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <Button variant="outline" onClick={handlePreviousTask}>
                      Previous Task
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleExitToMockTests}>
                        Exit Test
                      </Button>
                      <Button size="lg" onClick={handleSubmit} className="sm:w-auto">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit Answers
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WritingTest;
