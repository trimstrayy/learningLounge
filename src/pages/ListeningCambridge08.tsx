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

  const books = [13,14,15,16,17,18,19];
  const tests = [1,2,3,4];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-foreground">Cambridge IELTS 08</h1>
            <p className="text-lg text-muted-foreground">Listening Tests - Official Cambridge Materials</p>
          </div>

          <div className="space-y-4">
            {books.map((book) => {
              const isOpen = selectedTest === book;
              return (
                <div key={book}>
                  <Card
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      isOpen && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedTest(isOpen ? null : book)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Book {book}</span>
                        <ChevronRight
                          className={cn(
                            "transition-transform",
                            isOpen && "rotate-90"
                          )}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>4 tests • 4 sections each • 40 questions</p>
                      </div>
                    </CardContent>
                  </Card>

                  {isOpen && (
                    <div className="mt-4 p-6 border rounded-lg bg-card">
                      <h3 className="font-semibold mb-4">Tests in Book {book}</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {tests.map((t) => (
                          <div key={t} className="p-4 border rounded">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-semibold">Test {t}</div>
                                <div className="text-sm text-muted-foreground">4 sections • 40 questions</div>
                              </div>
                              <div>
                                <Button
                                  onClick={() => navigate(`/test/listening/book${book}-test${t}`)}
                                  size="sm"
                                >
                                  Begin
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
