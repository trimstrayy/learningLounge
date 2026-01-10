import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WritingCambridge08 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-foreground">IELTS MOCK TESTS</h1>
            <p className="text-lg text-muted-foreground">Writing Tests - Official Cambridge Materials</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <Clock className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center mb-2">
                Coming Soon
              </CardTitle>
              <p className="text-muted-foreground text-center">
                IELTS Writing Tests are currently under development
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 text-amber-600 dark:text-amber-400">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Evaluation Module Development in Progress</span>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  We're currently working to bring you comprehensive IELTS Writing practice tests
                  with official Cambridge materials, detailed feedback, and scoring.
                </p>
                <p>
                  <strong>What's coming:</strong>
                </p>
                <ul className="text-left space-y-1 max-w-md mx-auto">
                  <li>• Task 1 & Task 2 practice questions</li>
                  <li>• Automated scoring and feedback</li>
                  <li>• Time management tools</li>
                  <li>• Progress tracking over the dashboard</li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Stay tuned for updates! You can practice other modules in the meantime. <br />
                  You will be notified about the update of <b>Writing Tests</b>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WritingCambridge08;
