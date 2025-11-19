import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import TestHeader from "@/components/TestHeader";
import { useTestSession } from "@/hooks/useTestSession";
import { Card } from "@/components/ui/card";
import { loadQuestions } from "@/utils/loadQuestions";
import type { ReadingTest as RT } from "@/types/questions";
import { useToast } from "@/hooks/use-toast";

const ReadingTest = () => {
  const [test, setTest] = useState<RT | null>(null);
  const [loading, setLoading] = useState(true);
  const [passageText, setPassageText] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number | any>>({});
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  // overall test timer (like Writing)
  const durationMinutes = 60;
  // session hook (manages started/timeLeft/exit modal/navigation)
  const session = useTestSession(durationMinutes, {
    onConfirmExit: () => {
      // clear any page-local progress when user confirms exit
      setAnswers({});
      setSubmitted(false);
    }
  });

  useEffect(() => {
    setLoading(true);
    loadQuestions("reading", "reading-sample-1")
      .then((data) => {
        const r = data as RT;
        setTest(r);
        // fetch passage text
        if (r.passages && r.passages[0]) {
          fetch(r.passages[0].textFile)
            .then((res) => res.text())
            .then((txt) => setPassageText(txt))
            .catch(() => setPassageText(null));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // overall countdown timer (starts only after user clicks Begin)
  // timer now handled by useTestSession

  const onSubmit = () => {
    if (!test) return;

    // validation
    for (const p of test.passages) {
      for (const q of p.questions) {
        const val = answers[q.id];
        if (q.type === 'multiple-choice') {
          if (typeof val !== 'number') {
            toast({ title: 'Missing answer', description: `Please answer ${q.id} (multiple choice).`, variant: 'destructive' });
            return;
          }
        }
        if (q.type === 'true-false-notgiven') {
          if (val !== 'T' && val !== 'F' && val !== 'NG') {
            toast({ title: 'Missing answer', description: `Please mark True / False / Not Given for ${q.id}.`, variant: 'destructive' });
            return;
          }
        }
        if (q.type === 'matching-headings') {
          if (typeof val !== 'number') {
            toast({ title: 'Missing answer', description: `Please select a heading for ${q.id}.`, variant: 'destructive' });
            return;
          }
        }
      }
    }

    const payload = { testId: test.testId, answers, submittedAt: new Date().toISOString() };
    console.log('ready-to-upload', payload);
    toast({ title: 'Answers ready', description: 'All answers collected and ready to upload.' });
    setSubmitted(true);
  };

  // open/close/confirm handled by useTestSession (TestHeader triggers these)

  return (
    <div className="min-h-screen bg-background">
      <TestHeader title="Reading Test" session={session} />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Reading Test</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">This page loads a reading test JSON and displays passage and questions.</p>
          </div>

          {loading && <div>Loading test...</div>}

          {!loading && !test && <div className="text-red-500">Failed to load test.</div>}

          {test && (
            <div className="space-y-6">
              {test.passages.map((p) => (
                <Card key={p.id} className="p-4">
                  <h3 className="font-semibold mb-2">{p.title}</h3>
                  <div className="prose max-w-none text-sm mb-4">{p.id === test.passages[0].id ? (passageText ?? "") : ""}</div>
                  <div className="space-y-3">
                    {p.questions.map((q) => (
                      <div key={q.id} className="p-3 border rounded">
                        <div className="font-medium">{q.id} — {q.type}</div>
                        {q.question && <div className="text-sm text-muted-foreground mt-1">{q.question}</div>}

                        {q.type === "multiple-choice" && q.options && (
                          <div className="mt-2">
                            {q.options.map((opt, i) => (
                              <label key={i} className="block text-sm">
                                <input
                                  type="radio"
                                  name={q.id}
                                  checked={answers[q.id] === i}
                                  onChange={() => setAnswers(prev => ({ ...prev, [q.id]: i }))}
                                  className="mr-2"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === "true-false-notgiven" && q.statement && (
                          <div className="mt-2">
                            {([['T','True'], ['F','False'], ['NG','Not Given']] as [string,string][]).map(([val,label]) => (
                              <label key={val} className="block text-sm">
                                <input
                                  type="radio"
                                  name={q.id}
                                  checked={answers[q.id] === val}
                                  onChange={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                                  className="mr-2"
                                />
                                {label}
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === "matching-headings" && q.headings && (
                          <div className="mt-2">
                            <select
                              value={typeof answers[q.id] === 'number' ? answers[q.id] : ''}
                              onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: Number(e.target.value) }))}
                              className="border rounded px-2 py-1"
                            >
                              <option value="">Select heading</option>
                              {q.headings.map((h, i) => (
                                <option key={i} value={i}>{h}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              <div className="text-right">
                <div className="flex items-center justify-end gap-3">
                  {submitted && (
                    <button className="px-3 py-2 bg-amber-500 text-white rounded">Get Results</button>
                  )}
                  <button onClick={onSubmit} className="mt-4 px-4 py-2 bg-primary text-white rounded">Submit Answers</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {/* exit modal handled by TestHeader */}
    </div>
  );
};

export default ReadingTest;
