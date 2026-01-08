import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WritingCambridge08 = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  const books = [13, 14, 15, 16, 17, 18, 19];
  const tests = [1, 2, 3, 4];
  const LOCKED_RANGE = new Set([16, 17, 18, 19]);

  const [unlockedBooks, setUnlockedBooks] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("writingUnlockedBooks");
      return stored ? JSON.parse(stored) : Array.from(LOCKED_RANGE);
    } catch {
      return Array.from(LOCKED_RANGE);
    }
  });

  const [lockedTests, setLockedTests] = useState<Record<string, number[]>>(() => {
    try {
      const stored = localStorage.getItem("writingLockedTests");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("writingUnlockedBooks", JSON.stringify(unlockedBooks));
    } catch {}
  }, [unlockedBooks]);

  useEffect(() => {
    try {
      localStorage.setItem("writingLockedTests", JSON.stringify(lockedTests));
    } catch {}
  }, [lockedTests]);

  const isBookLocked = (book: number) => LOCKED_RANGE.has(book) && !unlockedBooks.includes(book);

  const toggleLock = (book: number) => {
    setUnlockedBooks(prev =>
      prev.includes(book)
        ? prev.filter(b => b !== book)
        : [...prev, book]
    );
  };

  const isTestLocked = (book: number, test: number) => {
    return lockedTests[book]?.includes(test) || false;
  };

  const toggleTestLock = (book: number, test: number) => {
    setLockedTests(prev => {
      const bookTests = prev[book] || [];
      const newBookTests = bookTests.includes(test)
        ? bookTests.filter(t => t !== test)
        : [...bookTests, test];
      return {
        ...prev,
        [book]: newBookTests.length > 0 ? newBookTests : undefined
      };
    });
  };

  const handleTestClick = (book: number, test: number) => {
    if (isBookLocked(book) || isTestLocked(book, test)) return;
    navigate(`/test/writing/book${book}-test${test}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-foreground">IELTS MOCK TESTS</h1>
            <p className="text-lg text-muted-foreground">Writing Tests - Official Cambridge Materials</p>
          </div>

          <div className="space-y-4">
            {books.map((book) => {
              const expanded = selectedBook === book;
              const locked = isBookLocked(book);
              return (
                <div key={book}>
                  <Card
                    className={cn(
                      "transition-all hover:shadow-lg",
                      expanded && "ring-2 ring-primary",
                      locked ? "opacity-60" : "cursor-pointer",
                      !locked && "hover:shadow-lg"
                    )}
                    onClick={() => {
                      if (!locked) {
                        setSelectedBook(expanded ? null : book);
                      }
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span>Book {book}</span>
                          {locked && <span className="text-xs text-muted-foreground">(Locked)</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {LOCKED_RANGE.has(book) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLock(book);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {unlockedBooks.includes(book) ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          <ChevronRight
                            className={cn(
                              "w-5 h-5 transition-transform",
                              expanded && "rotate-90"
                            )}
                          />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    {expanded && (
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {tests.map((test) => {
                            const isLocked = isTestLocked(book, test);
                            return (
                              <div key={test} className="relative">
                                <Button
                                  variant={isLocked ? "outline" : "default"}
                                  className={cn(
                                    "w-full h-20 flex flex-col items-center justify-center gap-2",
                                    isLocked && "opacity-60 cursor-not-allowed"
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTestClick(book, test);
                                  }}
                                  disabled={isLocked}
                                >
                                  <span className="font-medium">Test {test}</span>
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                                {LOCKED_RANGE.has(book) && !isBookLocked(book) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-background border shadow-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTestLock(book, test);
                                    }}
                                  >
                                    {isTestLocked(book, test) ? (
                                      <Lock className="w-3 h-3" />
                                    ) : (
                                      <Unlock className="w-3 h-3" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
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

export default WritingCambridge08;
