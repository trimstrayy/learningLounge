import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Volume2, Pause, Play } from "lucide-react";
import TestHeader from "@/components/TestHeader";
import { useTestSession } from "@/hooks/useTestSession";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  answerLength?: string;
  multipleSelect?: boolean;
}

interface Section {
  sectionNumber: number;
  audioUrl: string;
  questions: Question[];
}

interface ListeningTestData {
  testId: string;
  title: string;
  sections: Section[];
}

const ListeningTest = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<ListeningTestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [audioPlaying, setAudioPlaying] = useState<{ [key: number]: boolean }>({});
  
  const durationMinutes = 30;
  const session = useTestSession(durationMinutes, {
    onConfirmExit: () => {
      session.setStarted(false);
      session.setTimeLeft(durationMinutes * 60);
      setAnswers({});
      setSubmitted(false);
      setShowAnswers(false);
      navigate('/mock-tests');
    }
  });

  useEffect(() => {
    if (!testId) {
      navigate('/mock-tests');
      return;
    }
    
    setLoading(true);
    fetch(`/questions/listening/${testId}.json`)
      .then(res => res.json())
      .then((data: ListeningTestData) => setTest(data))
      .catch((err) => {
        console.error(err);
        toast({ title: "Error", description: "Failed to load test", variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, [testId, navigate, toast]);

  const onSubmit = () => {
    if (!test) return;

    const payload = {
      testId: test.testId,
      answers,
      submittedAt: new Date().toISOString(),
    };
    console.log("Test submitted", payload);
    toast({ title: 'Test Submitted', description: 'Your answers have been saved successfully.' });
    setSubmitted(true);
    
    // Navigate back to mock tests page with completion flag
    setTimeout(() => {
      navigate('/mock-tests?completed=listening');
    }, 1500);
  };

  const checkAnswer = (questionId: string, userAnswer: string | string[] | undefined, correctAnswer: string) => {
    if (!userAnswer) return false;
    
    if (Array.isArray(userAnswer)) {
      const correctAnswers = correctAnswer.split(',').map(a => a.trim());
      return userAnswer.length === correctAnswers.length && 
             userAnswer.every(a => correctAnswers.includes(a));
    }
    
    const userAnswerStr = String(userAnswer).toLowerCase().trim();
    const correctAnswerStr = correctAnswer.toLowerCase().trim();
    return userAnswerStr === correctAnswerStr;
  };

  return (
    <div className="min-h-screen bg-background">
      <TestHeader title={test?.title || "Listening Test"} session={session} />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading && <div className="text-center">Loading test...</div>}

          {!loading && !test && <div className="text-center text-destructive">Failed to load test.</div>}

          {test && !session.started && (
            <Card className="p-8 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">{test.title}</h2>
              <p className="text-muted-foreground mb-6">
                This test has {test.sections.length} sections with audio recordings. 
                You will have {durationMinutes} minutes to complete all sections.
              </p>
              <Button size="lg" onClick={() => session.setStarted(true)}>
                Begin Test
              </Button>
            </Card>
          )}

          {test && session.started && (
            <div className="space-y-6">
              {/* Answer Toggle */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="gap-2"
                >
                  {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAnswers ? "Hide Answers" : "Show Answers"}
                </Button>
              </div>

              {test.sections.map((sec, secIdx) => (
                <Card key={sec.sectionNumber} className="overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b">
                    <h3 className="font-semibold text-lg">Section {sec.sectionNumber}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Questions {sec.questions[0].id} - {sec.questions[sec.questions.length - 1].id}
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Audio Player */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Volume2 className="w-5 h-5 text-primary" />
                        <span className="font-medium">Section {sec.sectionNumber} Audio</span>
                      </div>
                      <audio 
                        controls 
                        src={sec.audioUrl} 
                        className="w-full"
                        onPlay={() => setAudioPlaying({ ...audioPlaying, [secIdx]: true })}
                        onPause={() => setAudioPlaying({ ...audioPlaying, [secIdx]: false })}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      {sec.questions.map((q) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = showAnswers && q.correctAnswer ? 
                          checkAnswer(q.id, userAnswer, q.correctAnswer) : null;

                        return (
                          <div 
                            key={q.id} 
                            className={cn(
                              "p-4 border rounded-lg",
                              showAnswers && isCorrect === true && "bg-green-50 border-green-200",
                              showAnswers && isCorrect === false && "bg-red-50 border-red-200"
                            )}
                          >
                            <div className="font-medium mb-2">
                              Question {q.id}
                            </div>
                            <div className="text-sm mb-3">{q.question}</div>

                            {/* Multiple Choice */}
                            {q.type === "multiple-choice" && q.options && !q.multipleSelect && (
                              <div className="space-y-2">
                                {q.options.map((opt, i) => (
                                  <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                      type="radio"
                                      name={q.id}
                                      value={String.fromCharCode(65 + i)}
                                      checked={answers[q.id] === String.fromCharCode(65 + i)}
                                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                      className="accent-primary"
                                    />
                                    <span>{String.fromCharCode(65 + i)}. {opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {/* Multiple Select */}
                            {q.type === "multiple-choice" && q.options && q.multipleSelect && (
                              <div className="space-y-2">
                                {q.options.map((opt, i) => {
                                  const optionValue = String.fromCharCode(65 + i);
                                  const selectedOptions = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                                  
                                  return (
                                    <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                                      <Checkbox
                                        checked={selectedOptions.includes(optionValue)}
                                        onCheckedChange={(checked) => {
                                          setAnswers(prev => {
                                            const current = Array.isArray(prev[q.id]) ? [...prev[q.id]] : [];
                                            if (checked) {
                                              return { ...prev, [q.id]: [...current, optionValue] };
                                            } else {
                                              return { ...prev, [q.id]: current.filter(v => v !== optionValue) };
                                            }
                                          });
                                        }}
                                      />
                                      <span>{optionValue}. {opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}

                            {/* Form Completion */}
                            {q.type === "form-completion" && (
                              <Input
                                type="text"
                                placeholder="Type your answer here"
                                value={(answers[q.id] as string) ?? ""}
                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                className="max-w-md"
                              />
                            )}

                            {/* Show Correct Answer */}
                            {showAnswers && q.correctAnswer && (
                              <div className={cn(
                                "mt-3 p-3 rounded text-sm",
                                isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              )}>
                                <strong>Correct Answer:</strong> {q.correctAnswer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              ))}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate('/mock-tests')}>
                  Exit Test
                </Button>
                <Button onClick={onSubmit} disabled={submitted} size="lg">
                  {submitted ? "Submitted" : "Submit Test"}
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

export default ListeningTest;
