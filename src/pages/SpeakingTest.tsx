import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import TestHeader from "@/components/TestHeader";
import { useTestSession } from "@/hooks/useTestSession";
import { ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { loadQuestions } from "@/utils/loadQuestions";
import type { SpeakingTest as ST } from "@/types/questions";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const SpeakingTest = () => {
  const navigate = useNavigate();
  const durationMinutes = 14; // speaking lasts 11-14 minutes; allocate 14 for mock timing
  // use shared session hook to manage started/timeLeft/exit modal/navigation
  const session = useTestSession(durationMinutes, {
    onConfirmExit: () => {
      // stop and clear any active recordings and answers
      try {
        Object.values(mediaRefs.current).forEach((info) => {
          try { info.stream?.getTracks().forEach(t => t.stop()); } catch {}
        });
      } catch {}
      mediaRefs.current = {} as any;
      setRecordingPart(null);
      setAnswers({});
      setSubmitted(false);
    }
  });
  const [test, setTest] = useState<ST | null>(null);
  const [loadingTest, setLoadingTest] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const mediaRefs = useRef<Record<string, { recorder?: MediaRecorder; chunks: Blob[]; stream?: MediaStream }>>({});
  const [recordingPart, setRecordingPart] = useState<string | null>(null);
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  // timer is handled inside useTestSession; mirror running to session.started
  useEffect(() => {
    if (session.started) return;
    // when session is not started we ensure secondsLeft is reset
    session.setTimeLeft(durationMinutes * 60);
  }, [session.started]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  useEffect(() => {
    setLoadingTest(true);
    loadQuestions("speaking", "speaking-sample-1")
      .then((data) => setTest(data as ST))
      .catch((err) => console.error(err))
      .finally(() => setLoadingTest(false));
  }, []);

  const startRecording = async (partKey: 'part1' | 'part2' | 'part3') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRefs.current[partKey] = { recorder, chunks: [], stream };
      recorder.ondataavailable = (e) => {
        if (!mediaRefs.current[partKey]) return;
        mediaRefs.current[partKey].chunks.push(e.data);
      };
      recorder.onstop = () => {
        const info = mediaRefs.current[partKey];
        if (!info) return;
        const blob = new Blob(info.chunks, { type: info.chunks[0]?.type || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAnswers(prev => ({ ...prev, [`${partKey}Audio`]: blob, [`${partKey}AudioUrl`]: url }));
        // stop tracks
        info.stream?.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setRecordingPart(partKey);
      // ensure test is marked started when user records
      session.setStarted(true);
    } catch (e) {
      console.error('Microphone access denied', e);
    }
  };

  const stopRecording = (partKey: 'part1' | 'part2' | 'part3') => {
    const info = mediaRefs.current[partKey];
    if (info && info.recorder && info.recorder.state !== 'inactive') {
      info.recorder.stop();
    }
    setRecordingPart(null);
  };

  const onSubmit = () => {
    if (!test) return;

    const missing: string[] = [];
    if (!answers.part1Audio) missing.push('Part 1 audio');
    if (!answers.part2Audio) missing.push('Part 2 audio');
    if (!answers.part3Audio) missing.push('Part 3 audio');
    if (missing.length > 0) {
      toast({ title: 'Missing recordings', description: `Please record: ${missing.join(', ')}`, variant: 'destructive' });
      return;
    }

    const payload = {
      testId: test.testId,
      answers,
      submittedAt: new Date().toISOString(),
    };
    console.log('ready-to-upload', payload);
    toast({ title: 'Recordings ready', description: 'All speaking parts recorded and ready to upload.' });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <TestHeader
        title="Speaking Test"
        session={session}
        recordingIndicator={recordingPart ? (
          <div className="flex items-center gap-2 text-sm mr-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Recording...
            </span>
          </div>
        ) : null}
      />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Speaking Test (Mock)</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              IELTS Speaking: a one-to-one interview in three parts. This mock environment follows the regulated format and provides prompts for practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Overview</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>Duration: ~11-14 minutes</div>
                <div>Parts: 3 (Interview, Long Turn, Discussion)</div>
                <div>Format: face-to-face style prompts and follow-ups</div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Test Parts</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                <li>Part 1 — Introduction & interview (4–5 minutes)</li>
                <li>Part 2 — Long turn (3–4 minutes) — prepare & speak for 1–2 minutes</li>
                <li>Part 3 — Two-way discussion on abstract ideas (4–5 minutes)</li>
              </ol>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Practice Prompts</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                <li>Describe a memorable trip</li>
                <li>Talk about a teacher who inspired you</li>
                <li>Discuss advantages and disadvantages of online education</li>
              </ul>
            </Card>
          </div>

          {/* removed middle timer — controls moved to top bar */}

          <div className="mt-6">
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Long Turn (Part 2) — Sample Task Card</h4>
              <div className="text-muted-foreground">
                {loadingTest && <div>Loading prompt...</div>}
                {!loadingTest && test && (
                  <>
                    <div className="mb-2">You will have 1 minute to prepare and 1–2 minutes to speak on the topic. Make notes if you wish.</div>
                    <div className="p-3 bg-muted rounded">
                      <strong>Topic:</strong> {test.part2.cueCard.topic}
                      <ul className="list-disc list-inside mt-2 text-sm">
                        {test.part2.cueCard.points.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {!loadingTest && !test && <div className="text-red-500">Failed to load speaking prompt.</div>}
              </div>
            </Card>
          </div>

          {/* Recording UI */}
          <div className="mt-6 space-y-6">
            {recordingPart && (
              <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded">
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="font-medium">Recording: {recordingPart}</span>
              </div>
            )}
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Part 1 — Interview</h4>
              <div className="space-y-2">
                {test?.part1.questions.map((q, i) => (
                  <div key={i} className="text-sm">{q}</div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => startRecording('part1')} disabled={recordingPart !== null} className="px-3 py-1 bg-primary text-white rounded">Start Recording Part 1</button>
                <button onClick={() => stopRecording('part1')} disabled={recordingPart !== 'part1'} className="px-3 py-1 bg-red-600 text-white rounded">Stop</button>
                {answers.part1AudioUrl && <audio controls src={answers.part1AudioUrl} className="ml-4" />}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-2">Part 2 — Long Turn</h4>
              <div className="mt-2 flex gap-2">
                <button onClick={() => startRecording('part2')} disabled={recordingPart !== null} className="px-3 py-1 bg-primary text-white rounded">Start Recording Part 2</button>
                <button onClick={() => stopRecording('part2')} disabled={recordingPart !== 'part2'} className="px-3 py-1 bg-red-600 text-white rounded">Stop</button>
                {answers.part2AudioUrl && <audio controls src={answers.part2AudioUrl} className="ml-4" />}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold mb-2">Part 3 — Discussion</h4>
              <div className="mt-2 flex gap-2">
                <button onClick={() => startRecording('part3')} disabled={recordingPart !== null} className="px-3 py-1 bg-primary text-white rounded">Start Recording Part 3</button>
                <button onClick={() => stopRecording('part3')} disabled={recordingPart !== 'part3'} className="px-3 py-1 bg-red-600 text-white rounded">Stop</button>
                {answers.part3AudioUrl && <audio controls src={answers.part3AudioUrl} className="ml-4" />}
              </div>
            </Card>

            <div className="text-right">
              <div className="flex items-center justify-end gap-3">
                {submitted && (
                  <Button className="px-3 py-2 bg-amber-500 text-white rounded">Get Results</Button>
                )}
                <Button onClick={onSubmit} className="mt-2 px-4 py-2 bg-primary text-white rounded">Submit Speaking Answers</Button>
              </div>
            </div>
          </div>

          {/* exit modal handled by TestHeader (session.showConfirmExit) */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpeakingTest;
