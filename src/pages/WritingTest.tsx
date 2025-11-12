import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Clock, Upload, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const WritingTest = () => {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
      toast({
        title: "Image uploaded",
        description: "Your handwritten answer has been uploaded successfully.",
      });
    }
  };

  const handleSubmit = () => {
    if (!writtenAnswer && !uploadedImage) {
      toast({
        title: "No answer provided",
        description: "Please provide either a typed or handwritten answer.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Answer submitted!",
      description: "Your writing test has been submitted for evaluation.",
    });

    // Redirect back to mock tests page with completion flag
    setTimeout(() => {
      navigate("/mock-tests?completed=writing");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/mock-tests">
                <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Exit Test
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">IELTS Writing Test</h1>
            </div>
            
            <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-mono font-semibold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </div>

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
          <Card className="p-6 mb-8 border-border">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-primary">Task 1</h2>
                <span className="text-sm text-muted-foreground">Minimum 150 words • 20 minutes</span>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-card-foreground leading-relaxed">
                  <strong>Placeholder Question:</strong> The chart below shows the number of international students studying in five different countries between 2010 and 2020.
                </p>
                <p className="text-muted-foreground mt-3">
                  Summarize the information by selecting and reporting the main features, and make comparisons where relevant.
                </p>
                <div className="mt-4 p-8 bg-muted rounded-lg text-center">
                  <p className="text-muted-foreground italic">[Chart/Graph will be displayed here]</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Task 2 */}
          <Card className="p-6 mb-8 border-border">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-primary">Task 2</h2>
                <span className="text-sm text-muted-foreground">Minimum 250 words • 40 minutes</span>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-card-foreground leading-relaxed">
                  <strong>Placeholder Question:</strong> Some people believe that studying abroad is essential for students' personal development, while others think that students can gain similar benefits by studying in their home country.
                </p>
                <p className="text-muted-foreground mt-3">
                  Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience.
                </p>
              </div>
            </div>
          </Card>

          {/* Answer Section */}
          <Card className="p-6 border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Your Answer</h3>
            
            {/* Typed Answer */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Type your answer
              </label>
              <Textarea
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                placeholder="Type your answer for both tasks here..."
                className="min-h-[400px] font-mono text-base"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Word count: {writtenAnswer.split(/\s+/).filter(word => word.length > 0).length}
              </p>
            </div>

            {/* Handwritten Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Or upload a photo of your handwritten answer
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-2">
                    {uploadedImage ? uploadedImage.name : "Click to upload image"}
                  </p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                </label>
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
              <Link to="/mock-tests" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Tests
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WritingTest;
