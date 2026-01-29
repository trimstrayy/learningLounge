import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  GraduationCap,
  Crown,
  MessageSquare,
  Star,
  TrendingUp,
  Clock,
  Shield,
  Settings,
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdmin';
import { AdminFeedbackPanel } from '@/components/admin/AdminFeedbackPanel';
import { AdminTeacherRequestsPanel } from '@/components/admin/AdminTeacherRequestsPanel';
import { AdminPremiumRequestsPanel } from '@/components/admin/AdminPremiumRequestsPanel';
import { AdminUsersPanel } from '@/components/admin/AdminUsersPanel';

export default function AdminDashboard() {
  const { role, loading, user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Teachers',
      value: stats?.totalTeachers ?? 0,
      icon: GraduationCap,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Premium Users',
      value: stats?.totalPremiumUsers ?? 0,
      icon: Crown,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Total Feedback',
      value: stats?.totalFeedback ?? 0,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating ? `${stats.averageRating}/5` : 'N/A',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const pendingItems = [
    {
      title: 'Teacher Requests',
      count: stats?.pendingTeacherRequests ?? 0,
      icon: GraduationCap,
      tab: 'teachers',
    },
    {
      title: 'Premium Requests',
      count: stats?.pendingPremiumRequests ?? 0,
      icon: Crown,
      tab: 'premium',
    },
    {
      title: 'Unreviewed Feedback',
      count: stats?.unreviewedFeedback ?? 0,
      icon: MessageSquare,
      tab: 'feedback',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container py-8 mt-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl shrink-0">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground truncate">
              Welcome back, Super Admin • {user?.email}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Teachers</span>
              {(stats?.pendingTeacherRequests ?? 0) > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                  {stats?.pendingTeacherRequests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="premium" className="gap-2">
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Premium</span>
              {(stats?.pendingPremiumRequests ?? 0) > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                  {stats?.pendingPremiumRequests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Feedback</span>
              {(stats?.unreviewedFeedback ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                  {stats?.unreviewedFeedback}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {statCards.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? '...' : stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pending Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {pendingItems.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => setActiveTab(item.tab)}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-2xl font-bold text-primary">
                          {statsLoading ? '...' : item.count}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                  <button
                    onClick={() => setActiveTab('teachers')}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <GraduationCap className="h-5 w-5 mb-2 text-green-500" />
                    <p className="font-medium">Review Teacher Applications</p>
                    <p className="text-sm text-muted-foreground">
                      Approve or reject teacher requests
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('premium')}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <Crown className="h-5 w-5 mb-2 text-amber-500" />
                    <p className="font-medium">Manage Premium Requests</p>
                    <p className="text-sm text-muted-foreground">
                      Process premium membership requests
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <MessageSquare className="h-5 w-5 mb-2 text-purple-500" />
                    <p className="font-medium">View User Feedback</p>
                    <p className="text-sm text-muted-foreground">
                      Read and respond to feedback
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <Users className="h-5 w-5 mb-2 text-blue-500" />
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-muted-foreground">
                      View and manage all users
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers">
            <AdminTeacherRequestsPanel />
          </TabsContent>

          {/* Premium Tab */}
          <TabsContent value="premium">
            <AdminPremiumRequestsPanel />
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <AdminFeedbackPanel />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <AdminUsersPanel />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
