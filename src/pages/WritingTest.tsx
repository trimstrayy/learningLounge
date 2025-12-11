import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import TestHeader from "@/components/TestHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTestSession } from "@/hooks/useTestSession";
import { loadQuestions } from "@/utils/loadQuestions";
import type { WritingTest as WT } from "@/types/questions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEYS = {
  task1Answer: "writing:task1:answer",
  task2Answer: "writing:task2:answer",
  task1Image: "writing:task1:image",
  task2Image: "writing:task2:image",
} as const;

const calculateWordCount = (value: string) => {
  export default WritingTest;

  const handleRedoTest = () => {
    resetLocalState();
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

  return (
    <div className="min-h-screen bg-background">
      <TestHeader title={test?.title ?? "IELTS Writing Test"} session={session} />
      <main className="pt-32 sm:pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {loadingTest && <div className="text-center">Loading writing tasks...</div>}
          {!loadingTest && !test && <div className="text-center text-destructive">Failed to load writing tasks.</div>}

          {test && !session.started && (
            <Card className="p-8 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">IELTS Writing Test</h2>
              <p className="text-muted-foreground mb-4">
                Practise Task 1 and Task 2 within {durationMinutes} minutes. Type your answers or upload photos of handwritten responses.
              </p>
              <div className="text-left text-sm text-muted-foreground space-y-2 mb-6">
                <p>• Task 1: describe the visual information (minimum 150 words).</p>
                <p>• Task 2: present an argument or solution (minimum 250 words).</p>
                <p>• Saved locally so you can pause and resume before submitting.</p>
              </div>
              <Button size="lg" onClick={() => session.setStarted(true)}>
                Begin Test
              </Button>
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
                        export default WritingTest;
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button variant="outline" onClick={handleExitToMockTests}>
                  Exit Test
                </Button>
                <Button size="lg" onClick={handleSubmit} className="sm:w-auto">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit Answers
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WritingTest;
                  </Card>

                  <Card className="p-6 border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-2xl font-bold text-primary">Task 2</h2>
                      <span className="text-sm text-muted-foreground">Minimum 250 words • 40 minutes</span>
                    </div>
                    <div className="p-4 bg-secondary/50 rounded-lg">
                      {!loadingTest && test ? (
                        <p className="text-card-foreground leading-relaxed">
                          <strong>Prompt:</strong> {test.task2.prompt}
                        </p>
                      ) : (
                        <p className="text-muted-foreground">Loading prompt…</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 border-border">
                    <h3 className="text-xl font-semibold text-card-foreground mb-4">Your Answers</h3>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-card-foreground mb-2">Task 1 — Type your answer</label>
                      <Textarea
                        value={task1Answer}
                        onChange={(e) => setTask1Answer(e.target.value)}
                        placeholder="Type your Task 1 answer here (minimum 150 words)"
                        className="min-h-[200px] font-mono text-base"
                      />
                      <p className="text-sm text-muted-foreground mt-2">Word count: {task1WordCount}</p>

                      <label className="block text-sm font-medium text-card-foreground mb-2 mt-4">Or upload a photo of your handwritten Task 1 answer</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 1)} className="hidden" id="image-upload-1" />
                        <label htmlFor="image-upload-1" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-2">{task1ImageData ? 'Image uploaded' : 'Click to upload image for Task 1'}</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                        </label>
                        {task1ImageData && (
                          <div className="mt-4">
                            <img src={task1ImageData} alt="Task 1 upload" className="mx-auto max-w-full" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-card-foreground mb-2">Task 2 — Type your answer</label>
                      <Textarea
                        value={task2Answer}
                        onChange={(e) => setTask2Answer(e.target.value)}
                        placeholder="Type your Task 2 answer here (minimum 250 words)"
                        className="min-h-[200px] font-mono text-base"
                      />
                      <p className="text-sm text-muted-foreground mt-2">Word count: {task2WordCount}</p>

                      <label className="block text-sm font-medium text-card-foreground mb-2 mt-4">Or upload a photo of your handwritten Task 2 answer</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 2)} className="hidden" id="image-upload-2" />
                        <label htmlFor="image-upload-2" className="cursor-pointer">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground mb-2">{task2ImageData ? 'Image uploaded' : 'Click to upload image for Task 2'}</p>
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

                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button variant="outline" onClick={handleExitToMockTests}>
                      Exit Test
                    </Button>
                    <Button size="lg" onClick={handleSubmit} className="sm:w-auto">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Answers
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
          <Footer />
        </div>
      );
                size="lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit Answer
              </Button>
              {submitted && (
                <button className="px-4 py-2 bg-amber-500 text-white rounded">Get Results</button>
              )}
              <Button variant="outline" className="w-full" size="lg" onClick={() => setShowConfirmExit(true)}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Tests
              </Button>
            </div>
          </Card>
        </div>
      </main>
      {showConfirmExit && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/40 z-40" onClick={() => setShowConfirmExit(false)} />
          <div className="relative z-50 w-[92%] max-w-md pointer-events-auto">
            <Card className="p-4">
              <h3 className="font-semibold">Exit Test?</h3>
              <p className="text-sm text-muted-foreground mt-2">Exiting will end your attempt and clear any progress. Do you want to exit?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowConfirmExit(false)}>Continue Test</Button>
                <Button className="bg-red-600" onClick={() => {
                  // close modal first, reset state and clear drafts, then navigate
                  setShowConfirmExit(false);
                  session.setStarted(false);
                  session.setTimeLeft(60*60);
                  try {
                    localStorage.removeItem('writing:task1:answer');
                    localStorage.removeItem('writing:task2:answer');
                    localStorage.removeItem('writing:task1:image');
                    localStorage.removeItem('writing:task2:image');
                  } catch {}
                  navigate('/mock-tests');
                }}>Exit and Lose Progress</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingTest;
