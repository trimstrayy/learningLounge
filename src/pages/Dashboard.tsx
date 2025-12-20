import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Headphones, Mic, PenTool, TrendingUp, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TestResult {
  id: string;
  test_id: string;
  test_type: string;
  correct_count: number;
  total_questions: number;
  band_score: number;
  duration_minutes: number | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setTestResults(data);
      }
      setLoadingResults(false);
    };

    if (user) {
      fetchResults();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Calculate stats from real data
  const testsCompleted = testResults.length;
  const averageScore = testsCompleted > 0 
    ? testResults.reduce((sum, r) => sum + Number(r.band_score), 0) / testsCompleted 
    : 0;
  const practiceHours = Math.round(
    testResults.reduce((sum, r) => sum + (r.duration_minutes || 0), 0) / 60
  );

  const getSkillStats = (type: string) => {
    const typeResults = testResults.filter(r => r.test_type === type);
    return {
      completed: typeResults.length,
      avgScore: typeResults.length > 0 
        ? typeResults.reduce((sum, r) => sum + Number(r.band_score), 0) / typeResults.length 
        : 0
    };
  };

  const skillStats = [
    { name: "Listening", icon: Headphones, ...getSkillStats('listening') },
    { name: "Reading", icon: BookOpen, ...getSkillStats('reading') },
    { name: "Writing", icon: PenTool, ...getSkillStats('writing') },
    { name: "Speaking", icon: Mic, ...getSkillStats('speaking') },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.email}! Track your IELTS preparation progress.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tests Completed
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{testsCompleted}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Score
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {averageScore > 0 ? averageScore.toFixed(1) : "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Practice Hours
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{practiceHours}h</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Target Score
                </CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">7.0</div>
              </CardContent>
            </Card>
          </div>

          {/* Skill Breakdown */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Skills Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {skillStats.map((skill) => (
              <Card key={skill.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <skill.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tests taken</span>
                      <span className="font-medium text-foreground">{skill.completed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. score</span>
                      <span className="font-medium text-foreground">
                        {skill.avgScore > 0 ? skill.avgScore.toFixed(1) : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="py-4">
              {loadingResults ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : testResults.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p>No recent activity yet.</p>
                  <p className="text-sm mt-1">Start taking tests to see your progress here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {testResults.slice(0, 10).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        {result.test_type === 'listening' && <Headphones className="h-5 w-5 text-primary" />}
                        {result.test_type === 'reading' && <BookOpen className="h-5 w-5 text-primary" />}
                        {result.test_type === 'writing' && <PenTool className="h-5 w-5 text-primary" />}
                        {result.test_type === 'speaking' && <Mic className="h-5 w-5 text-primary" />}
                        <div>
                          <p className="font-medium text-foreground capitalize">{result.test_type} Test</p>
                          <p className="text-sm text-muted-foreground">{result.test_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">Band {result.band_score}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(result.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;