import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Headphones, BookOpen, PenTool, Mic, Clock, FileText, Target, CheckCircle, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const testTypes = [
  {
    id: "listening",
    title: "Listening Test",
    icon: Headphones,
    duration: "30 minutes",
    questions: "40 questions",
    description: "The IELTS Listening test consists of four recorded monologues and conversations. You'll hear a range of accents including British, Australian, New Zealand, American, and Canadian.",
    format: [
      "Section 1: Conversation between two people in an everyday social context",
      "Section 2: Monologue in an everyday social context",
      "Section 3: Conversation between up to four people in an educational context",
      "Section 4: Monologue on an academic subject"
    ],
    scoring: "Each correct answer receives one mark. Scores are reported in whole and half bands.",
    color: "bg-blue-500"
  },
  {
    id: "reading",
    title: "Reading Test",
    icon: BookOpen,
    duration: "60 minutes",
    questions: "40 questions",
    description: "The IELTS Reading test features three long texts which range from descriptive and factual to discursive and analytical. Texts are taken from books, journals, magazines, and newspapers.",
    format: [
      "3 sections with increasing difficulty",
      "Variety of question types: multiple choice, identifying information, matching headings, sentence completion, and more",
      "Texts are authentic and taken from real publications",
      "Academic topics of general interest suitable for test takers"
    ],
    scoring: "Each correct answer receives one mark. Band scores are calculated from the total marks.",
    color: "bg-green-500"
  },
  {
    id: "writing",
    title: "Writing Test",
    icon: FileText,
    duration: "60 minutes",
    questions: "2 tasks",
    description: "The IELTS Writing test requires you to complete two tasks. Task 1 requires you to describe visual information, while Task 2 is an essay in response to a point of view, argument or problem.",
    format: [
      "Task 1: Describe, summarize or explain information in a graph, table, chart or diagram (minimum 150 words)",
      "Task 2: Write an essay in response to a point of view, argument or problem (minimum 250 words)",
      "Suggested time: 20 minutes for Task 1, 40 minutes for Task 2",
      "Both tasks must be completed to get a band score"
    ],
    scoring: "Task 2 carries more weight. Assessed on task achievement, coherence, vocabulary, and grammar.",
    color: "bg-amber-500"
  },
  {
    id: "speaking",
    title: "Speaking Test",
    icon: Mic,
    duration: "11-14 minutes",
    questions: "3 parts",
    description: "The IELTS Speaking test is a one-to-one conversation with a certified examiner. It assesses your use of spoken English through three parts.",
    format: [
      "Part 1: Introduction and interview (4-5 minutes) - familiar topics like home, family, work, studies",
      "Part 2: Long turn (3-4 minutes) - speak about a particular topic based on a task card",
      "Part 3: Discussion (4-5 minutes) - further discussion of the topic in Part 2"
    ],
    scoring: "Assessed on fluency, vocabulary, grammar, and pronunciation. Band scores from 0 to 9.",
    color: "bg-purple-500"
  }
];

const MockTests = () => {
  const [searchParams] = useSearchParams();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check for completed test from URL params
    const completed = searchParams.get('completed');
    if (completed) {
      setCompletedTests(prev => new Set([...prev, completed]));
    }

    // Load from localStorage
    const saved = localStorage.getItem('completedTests');
    if (saved) {
      setCompletedTests(new Set(JSON.parse(saved)));
    }
  }, [searchParams]);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('completedTests', JSON.stringify([...completedTests]));
  }, [completedTests]);

  const handleTestClick = (testId: string) => {
    setSelectedTest(selectedTest === testId ? null : testId);
  };

  const closeDetails = () => setSelectedTest(null);

  // lock body scroll on mobile modal open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (selectedTest && isMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [selectedTest]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">IELTS Mock Tests</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Practice with our comprehensive IELTS mock tests designed to simulate the actual exam experience. Each test follows the official IELTS format and timing.
            </p>
          </div>

          {/* Test Overview Cards with Inline Details */}
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        {testTypes.map((test, index) => {
              const Icon = test.icon;
              const isCompleted = completedTests.has(test.id);
              const isSelected = selectedTest === test.id;
              const dimmed = selectedTest !== null && !isSelected;
              const isLastInRow = (index + 1) % 4 === 0;
              const isLastCard = index === testTypes.length - 1;
              
              return (
                <>
                  <Card 
                    key={test.id} 
                    className={cn(
                      "p-4 border-2 cursor-pointer transition-all",
                      isCompleted && "border-green-500 bg-green-50 dark:bg-green-950/20",
                      isSelected && !isCompleted && "border-primary shadow-lg rounded-b-none",
                      !isCompleted && !isSelected && "border-border hover:shadow-md hover:border-primary/50",
                      dimmed && "opacity-50"
                    )}
                    onClick={() => handleTestClick(test.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isCompleted ? "bg-green-500" : `${test.color} bg-opacity-10`
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className={`w-5 h-5 ${test.color.replace('bg-', 'text-')}`} />
                        )}
                      </div>
                      <h3 className={cn(
                        "font-semibold",
                        isCompleted ? "text-green-700 dark:text-green-400" : "text-card-foreground"
                      )}>
                        {test.title}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{test.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{test.questions}</span>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="mt-2 text-xs text-green-700 dark:text-green-400 font-medium">
                        ✓ Completed
                      </div>
                    )}
                  </Card>

                  {/* Inline expanded panel removed — expanded details render below the grid to avoid shifting cards */}
                </>
              );
            })}
          </div>

          {/* Expanded details panel (renders below the grid so cards keep their positions) */}
          {selectedTest && (() => {
            const activeTest = testTypes.find((t) => t.id === selectedTest);
            if (!activeTest) return null;
            const Icon = activeTest.icon;
            return (
              <div className="md:col-span-4 animate-fade-in mt-4">
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <Card className="border-2 border-primary overflow-hidden bg-card rounded-t-none">
                    <div className="px-6 py-6 space-y-4">
                      <p className="text-muted-foreground leading-relaxed">{activeTest.description}</p>

                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Test Format
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          {activeTest.format.map((item, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2">Scoring</h4>
                        <p className="text-muted-foreground">{activeTest.scoring}</p>
                      </div>

                      <Link to={`/test/${activeTest.id}`}>
                        <Button className="mt-4 bg-primary hover:bg-primary/90">
                          Start {activeTest.title}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              </div>
            );
          })()}

          {/* Mobile modal: fixed, viewport-centered overlay (center of device screen, not page length) */}
          {selectedTest && typeof window !== 'undefined' && window.innerWidth < 768 && (() => {
            const activeTest = testTypes.find((t) => t.id === selectedTest);
            if (!activeTest) return null;

            const modal = (
              <div className="fixed inset-0 z-50">
                {/* backdrop */}
                <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />

                {/* dialog fixed to viewport center (portal prevents ancestor transform issues) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => e.stopPropagation()}
                  className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2"
                >
                  <Card className="p-4 overflow-hidden">
                    <button aria-label="Close" onClick={closeDetails} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100">
                      <X className="w-5 h-5" />
                    </button>

                    {/* Scrollable content with constrained height so the dialog itself remains centered in the viewport */}
                    <div className="pt-2 overflow-y-auto max-h-[80vh] pr-2">
                      <h3 className="text-xl font-semibold mb-2">{activeTest.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{activeTest.duration} • {activeTest.questions}</p>
                      <p className="text-muted-foreground leading-relaxed mb-4">{activeTest.description}</p>
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Test Format
                        </h4>
                        <ul className="space-y-2 text-muted-foreground">
                          {activeTest.format.map((item, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold text-card-foreground mb-2">Scoring</h4>
                        <p className="text-muted-foreground">{activeTest.scoring}</p>
                      </div>
                      <div className="mt-4 text-right">
                        <Link to={`/test/${activeTest.id}`}>
                          <Button className="bg-primary hover:bg-primary/90">Start {activeTest.title}</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            );

            // render modal into document.body to avoid ancestor transform/layout affecting fixed positioning
            return createPortal(modal, document.body);
          })()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MockTests;
