import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Search,
  Filter,
  FileText,
  Briefcase,
  Award,
} from 'lucide-react';
import { useAllTeacherRequests, useReviewTeacherRequest, TeacherRequest } from '@/hooks/useAdmin';
import { format } from 'date-fns';

export function AdminTeacherRequestsPanel() {
  const { data: requests, isLoading } = useAllTeacherRequests();
  const reviewRequest = useReviewTeacherRequest();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<TeacherRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

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

  const handleReview = async (approved: boolean) => {
    if (!selectedRequest) return;
    await reviewRequest.mutateAsync({
      requestId: selectedRequest.id,
      userId: selectedRequest.user_id,
      approved,
      adminNotes,
    });
    setSelectedRequest(null);
    setAdminNotes('');
    setReviewAction(null);
  };

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
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Teacher Requests ({requests?.length ?? 0})
          </CardTitle>
          <CardDescription>
            Review and manage teacher/consultancy applications
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                          Applied: {format(new Date(request.created_at), 'PPP')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRequest(request)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setReviewAction('approve');
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedRequest(request);
                            setReviewAction('reject');
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                    {request.reason && (
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm font-medium mb-1 flex items-center gap-1">
                          <FileText className="h-3 w-3" /> Reason
                        </p>
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
                    className={`p-4 border rounded-lg space-y-2 ${
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                      >
                        View Details
                      </Button>
                    </div>
                    {request.admin_notes && (
                      <p className="text-sm text-muted-foreground italic">
                        Admin notes: {request.admin_notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!filteredRequests || filteredRequests.length === 0) && (
            <p className="text-muted-foreground text-center py-8">
              No teacher requests found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedRequest && !reviewAction}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Teacher Application Details</DialogTitle>
            <DialogDescription>
              Review the application from {selectedRequest?.user_name || 'Unknown User'}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="font-medium">{selectedRequest.user_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p>{selectedRequest.user_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Applied On
                  </label>
                  <p>{format(new Date(selectedRequest.created_at), 'PPP')}</p>
                </div>
              </div>

              {selectedRequest.reason && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Reason for Applying
                  </p>
                  <p className="text-sm">{selectedRequest.reason}</p>
                </div>
              )}

              {selectedRequest.qualifications && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" /> Qualifications
                  </p>
                  <p className="text-sm">{selectedRequest.qualifications}</p>
                </div>
              )}

              {selectedRequest.experience && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Experience
                  </p>
                  <p className="text-sm">{selectedRequest.experience}</p>
                </div>
              )}

              {selectedRequest.admin_notes && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-1">Admin Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.admin_notes}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Close
            </Button>
            {selectedRequest?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setReviewAction('reject')}
                >
                  Reject
                </Button>
                <Button onClick={() => setReviewAction('approve')}>
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Action Dialog */}
      <Dialog
        open={!!reviewAction}
        onOpenChange={() => {
          setReviewAction(null);
          setAdminNotes('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Application
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'This will grant teacher privileges to the user.'
                : 'This will reject the teacher application.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Admin Notes (Optional)
              </label>
              <Textarea
                placeholder="Add notes about this decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReviewAction(null);
                setAdminNotes('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
              onClick={() => handleReview(reviewAction === 'approve')}
              disabled={reviewRequest.isPending}
            >
              {reviewRequest.isPending
                ? 'Processing...'
                : reviewAction === 'approve'
                ? 'Confirm Approval'
                : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
