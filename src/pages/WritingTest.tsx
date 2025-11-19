import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TestHeader from "@/components/TestHeader";
import { useTestSession } from "@/hooks/useTestSession";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Clock, Upload, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loadQuestions } from "@/utils/loadQuestions";
import type { WritingTest as WT } from "@/types/questions";

const WritingTest = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [task1Answer, setTask1Answer] = useState("");
  const [task2Answer, setTask2Answer] = useState("");
  const [task1ImageData, setTask1ImageData] = useState<string | null>(null);
  const [task2ImageData, setTask2ImageData] = useState<string | null>(null);
  const [test, setTest] = useState<WT | null>(null);
  const [loadingTest, setLoadingTest] = useState(true);
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const [startedLocal, setStartedLocal] = useState(false); // local mirrors for UI where needed
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  const session = useTestSession(60, {
    onConfirmExit: () => {
      // clear any page-local progress when user confirms exit
      setTask1Answer('');
      setTask2Answer('');
      setTask1ImageData(null);
      setTask2ImageData(null);
      setSubmitted(false);
      try {
        localStorage.removeItem('writing:task1:answer');
        localStorage.removeItem('writing:task2:answer');
        localStorage.removeItem('writing:task1:image');
        localStorage.removeItem('writing:task2:image');
      } catch {}
      session.setStarted(false);
      session.setTimeLeft(60 * 60);
    }
  });

  // run timer only after user clicks Begin — handled by session
  useEffect(() => {
    // keep a local started state for any UI bits that still reference it
    setStartedLocal(session.started);
  }, [session.started]);

  useEffect(() => {
    setLoadingTest(true);
    loadQuestions("writing", "writing-sample-1")
      .then((data) => setTest(data as WT))
      .catch((err) => console.error(err))
      .finally(() => setLoadingTest(false));
  }, []);

  // load drafts from localStorage
  useEffect(() => {
    try {
      const d1 = localStorage.getItem("writing:task1:answer");
      const d2 = localStorage.getItem("writing:task2:answer");
      const i1 = localStorage.getItem("writing:task1:image");
      const i2 = localStorage.getItem("writing:task2:image");
      if (d1) setTask1Answer(d1);
      if (d2) setTask2Answer(d2);
      if (i1) setTask1ImageData(i1);
      if (i2) setTask2ImageData(i2);
    } catch (e) {
      /* ignore */
    }
  }, []);

  // autosave answers
  useEffect(() => { try { localStorage.setItem("writing:task1:answer", task1Answer); } catch {} }, [task1Answer]);
  useEffect(() => { try { localStorage.setItem("writing:task2:answer", task2Answer); } catch {} }, [task2Answer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, task: 1 | 2) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (task === 1) {
        setTask1ImageData(dataUrl);
        try { localStorage.setItem("writing:task1:image", dataUrl); } catch {}
      } else {
        setTask2ImageData(dataUrl);
        try { localStorage.setItem("writing:task2:image", dataUrl); } catch {}
      }
      toast({ title: "Image uploaded", description: "Your handwritten answer has been uploaded successfully." });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!task1Answer && !task2Answer && !task1ImageData && !task2ImageData) {
      toast({
        title: "No answer provided",
        description: "Please provide at least one typed answer or upload a handwritten image for Task 1 or Task 2.",
        variant: "destructive",
      });
      return;
    }

    // prepare payload
    const payload = {
      testId: test?.testId ?? 'writing-sample-1',
      answers: {
        task1: task1Answer,
        task2: task2Answer,
        task1Image: task1ImageData ?? null,
        task2Image: task2ImageData ?? null,
      },
      submittedAt: new Date().toISOString(),
    };
    console.log('ready-to-upload', payload);

    toast({
      title: "Answer submitted!",
      description: "Your writing test has been submitted for evaluation.",
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowConfirmExit(true)} variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Test
              </Button>
              <h1 className="text-xl font-semibold">IELTS Writing Test</h1>
            </div>

            <div className="flex items-center gap-3">
              {!session.started ? (
                <Button onClick={() => session.setStarted(true)} className="bg-primary">Begin Test</Button>
              ) : (
                <span className="px-3 py-1 rounded bg-muted text-sm text-muted-foreground">Test running</span>
              )}
              <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-2 rounded-lg ml-3">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-mono font-semibold">
                  {formatTime(session.timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TestHeader title="IELTS Writing Test" session={session} />

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Instructions */}
          <Card className="p-6 mb-8 border-border bg-secondary/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h2 className="font-semibold text-card-foreground mb-2">Test Instructions</h2>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complete both Task 1 and Task 2 within 60 minutes</li>
                  <li>• You may type your answer or upload a photo of your handwritten response</li>
                  <li>• Task 1: Minimum 150 words (20 minutes suggested)</li>
                  <li>• Task 2: Minimum 250 words (40 minutes suggested)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Task 1 */}
          <Card onClick={() => { if (submitted) { const ok = window.confirm('Do you want to test again?'); if (ok) { setTask1Answer(''); setTask2Answer(''); setTask1ImageData(null); setTask2ImageData(null); setSubmitted(false); try { localStorage.removeItem('writing:task1:answer'); localStorage.removeItem('writing:task2:answer'); localStorage.removeItem('writing:task1:image'); localStorage.removeItem('writing:task2:image'); } catch {} } } }} className={`p-6 mb-8 border-border ${submitted ? 'bg-emerald-100 cursor-pointer' : ''}`}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-primary">Task 1</h2>
                <span className="text-sm text-muted-foreground">Minimum 150 words • 20 minutes</span>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                {!loadingTest && test ? (
                  <>
                    <p className="text-card-foreground leading-relaxed">
                      <strong>Task:</strong> {test.task1.prompt}
                    </p>
                    <p className="text-muted-foreground mt-3">Please summarise the chart and make comparisons where relevant.</p>
                    {test.task1.imageUrl ? (
                      <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                        <img src={test.task1.imageUrl} alt="task1 visual" className="mx-auto max-w-full" />
                      </div>
                    ) : (
                      <div className="mt-4 p-8 bg-muted rounded-lg text-center">
                        <p className="text-muted-foreground italic">[No image provided for this task]</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-4 p-8 bg-muted rounded-lg text-center">
                    <p className="text-muted-foreground italic">Loading task...</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Task 2 */}
          <Card className={`p-6 mb-8 border-border ${submitted ? 'bg-emerald-100' : ''}`}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-primary">Task 2</h2>
                <span className="text-sm text-muted-foreground">Minimum 250 words • 40 minutes</span>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                {!loadingTest && test ? (
                  <>
                    <p className="text-card-foreground leading-relaxed">
                      <strong>Prompt:</strong> {test.task2.prompt}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Loading prompt…</p>
                )}
              </div>
            </div>
          </Card>

          {/* Answer Section */}
          <Card className="p-6 border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Your Answer</h3>
            
            {/* Task 1 Answer */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-card-foreground mb-2">Task 1 — Type your answer</label>
              <Textarea
                value={task1Answer}
                onChange={(e) => setTask1Answer(e.target.value)}
                placeholder="Type your Task 1 answer here (minimum 150 words)"
                className="min-h-[200px] font-mono text-base"
              />
              <p className="text-sm text-muted-foreground mt-2">Word count: {task1Answer.split(/\s+/).filter(word => word.length > 0).length}</p>

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
                    <img src={task1ImageData} alt="task1 upload" className="mx-auto max-w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Task 2 Answer */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-card-foreground mb-2">Task 2 — Type your answer</label>
              <Textarea
                value={task2Answer}
                onChange={(e) => setTask2Answer(e.target.value)}
                placeholder="Type your Task 2 answer here (minimum 250 words)"
                className="min-h-[200px] font-mono text-base"
              />
              <p className="text-sm text-muted-foreground mt-2">Word count: {task2Answer.split(/\s+/).filter(word => word.length > 0).length}</p>

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
                    <img src={task2ImageData} alt="task2 upload" className="mx-auto max-w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 flex-1"
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
