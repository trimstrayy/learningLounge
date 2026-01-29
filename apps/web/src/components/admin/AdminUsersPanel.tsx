import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Crown,
  GraduationCap,
  Shield,
  Search,
  Filter,
  Mail,
  Calendar,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface UserProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  is_premium: boolean;
  created_at: string;
  roles: string[];
}

export function AdminUsersPanel() {
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Map roles to users
      const roleMap = new Map<string, string[]>();
      roles?.forEach((r) => {
        const existing = roleMap.get(r.user_id) || [];
        existing.push(r.role);
        roleMap.set(r.user_id, existing);
      });

      return profiles?.map((profile) => ({
        ...profile,
        roles: roleMap.get(profile.user_id) || ['student'],
      })) as UserProfile[];
    },
    enabled: role === 'super_admin',
  });

  const filteredUsers = users?.filter((user) => {
    const searchMatch =
      searchQuery === '' ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const roleMatch =
      roleFilter === 'all' ||
      (roleFilter === 'premium' && user.is_premium) ||
      user.roles.includes(roleFilter);

    return searchMatch && roleMatch;
  });

  const getRoleBadge = (userRoles: string[], isPremium: boolean) => {
    const badges = [];

    if (userRoles.includes('super_admin')) {
      badges.push(
        <Badge key="admin" className="gap-1 bg-purple-500">
          <Shield className="h-3 w-3" /> Admin
        </Badge>
      );
    }
    if (userRoles.includes('consultancy_owner')) {
      badges.push(
        <Badge key="teacher" className="gap-1 bg-green-500">
          <GraduationCap className="h-3 w-3" /> Teacher
        </Badge>
      );
    }
    if (isPremium) {
      badges.push(
        <Badge key="premium" className="gap-1 bg-amber-500">
          <Crown className="h-3 w-3" /> Premium
        </Badge>
      );
    }
    if (badges.length === 0) {
      badges.push(
        <Badge key="student" variant="secondary">
          Student
        </Badge>
      );
    }

    return badges;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users ({users?.length ?? 0})
          </CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="super_admin">Super Admins</SelectItem>
                <SelectItem value="consultancy_owner">Teachers</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="premium">Premium Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          {!filteredUsers || filteredUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No users found</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {user.full_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {getRoleBadge(user.roles, user.is_premium)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(user.created_at), 'PP')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold">{users?.length ?? 0}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {users?.filter((u) => u.roles.includes('consultancy_owner')).length ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Teachers</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-600">
                {users?.filter((u) => u.is_premium).length ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Premium</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">
                {users?.filter((u) => u.roles.includes('super_admin')).length ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
