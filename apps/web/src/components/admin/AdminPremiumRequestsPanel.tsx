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
  Crown,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Search,
  Filter,
} from 'lucide-react';
import { useAllPremiumRequests, useReviewPremiumRequest, PremiumRequest } from '@/hooks/usePremium';
import { format } from 'date-fns';

export function AdminPremiumRequestsPanel() {
  const { data: requests, isLoading } = useAllPremiumRequests();
  const reviewRequest = useReviewPremiumRequest();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = requests?.filter((request) => {
    const searchMatch =
      searchQuery === '' ||
      request.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      statusFilter === 'all' || request.status === statusFilter;

    return searchMatch && statusMatch;
  });

  const pendingRequests = filteredRequests?.filter((r) => r.status === 'pending') ?? [];
  const processedRequests = filteredRequests?.filter((r) => r.status !== 'pending') ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="gap-1 bg-green-500">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return null;
    }
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
            <Crown className="h-5 w-5 text-amber-500" />
            Premium Requests ({requests?.length ?? 0})
          </CardTitle>
          <CardDescription>
            Manage student premium membership requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Requests ({pendingRequests.length})
              </h3>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg border-l-4 border-l-amber-500 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.user_name || 'Unknown User'}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.user_email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Requested: {format(new Date(request.created_at), 'PPP')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            reviewRequest.mutate({
                              requestId: request.id,
                              userId: request.user_id,
                              approved: true,
                            })
                          }
                          disabled={reviewRequest.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            reviewRequest.mutate({
                              requestId: request.id,
                              userId: request.user_id,
                              approved: false,
                            })
                          }
                          disabled={reviewRequest.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                    {request.reason && (
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm">{request.reason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processed Requests */}
          {processedRequests.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">
                Processed Requests ({processedRequests.length})
              </h3>
              <div className="space-y-4">
                {processedRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 border rounded-lg ${
                      request.status === 'approved'
                        ? 'border-l-4 border-l-green-500'
                        : 'border-l-4 border-l-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {request.user_name || 'Unknown User'}
                          </span>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.user_email}
                        </p>
                        {request.reviewed_at && (
                          <p className="text-sm text-muted-foreground">
                            Reviewed: {format(new Date(request.reviewed_at), 'PPP')}
                          </p>
                        )}
                      </div>
                    </div>
                    {request.reason && (
                      <p className="text-sm bg-muted p-2 rounded mt-2">
                        {request.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!filteredRequests || filteredRequests.length === 0) && (
            <p className="text-muted-foreground text-center py-8">
              No premium requests found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
