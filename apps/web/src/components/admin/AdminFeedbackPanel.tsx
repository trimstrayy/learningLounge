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
  MessageSquare,
  Star,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle,
  Trash2,
  Eye,
  Search,
  Filter,
} from 'lucide-react';
import { useAllFeedback, useReviewFeedback, useDeleteFeedback, FeedbackItem } from '@/hooks/useAdmin';
import { format } from 'date-fns';

export function AdminFeedbackPanel() {
  const { data: feedback, isLoading } = useAllFeedback();
  const reviewFeedback = useReviewFeedback();
  const deleteFeedback = useDeleteFeedback();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'reviewed' | 'pending'>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredFeedback = feedback?.filter((item) => {
    // Search filter
    const searchMatch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const statusMatch =
      statusFilter === 'all' ||
      (statusFilter === 'reviewed' && item.is_reviewed) ||
      (statusFilter === 'pending' && !item.is_reviewed);

    // Rating filter
    const ratingMatch =
      ratingFilter === 'all' || item.rating === parseInt(ratingFilter);

    return searchMatch && statusMatch && ratingMatch;
  });

  const handleReview = async () => {
    if (!selectedFeedback) return;
    await reviewFeedback.mutateAsync({
      feedbackId: selectedFeedback.id,
      adminNotes,
    });
    setSelectedFeedback(null);
    setAdminNotes('');
  };

  const handleDelete = async (id: string) => {
    await deleteFeedback.mutateAsync(id);
    setDeleteConfirm(null);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return <Badge className="bg-green-500">Positive</Badge>;
    if (rating === 3) return <Badge variant="secondary">Neutral</Badge>;
    return <Badge variant="destructive">Negative</Badge>;
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
            <MessageSquare className="h-5 w-5" />
            User Feedback ({feedback?.length ?? 0})
          </CardTitle>
          <CardDescription>
            View and manage feedback from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or message..."
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
                <SelectItem value="reviewed">Reviewed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <Star className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feedback List */}
          {!filteredFeedback || filteredFeedback.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No feedback found
            </p>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg space-y-3 ${
                    !item.is_reviewed ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.name}</span>
                        <div className="flex">{getRatingStars(item.rating)}</div>
                        {getRatingBadge(item.rating)}
                        {item.is_reviewed ? (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle className="h-3 w-3" /> Reviewed
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending Review</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {item.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {item.email}
                          </span>
                        )}
                        {item.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {item.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.created_at), 'PPP')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedFeedback(item);
                          setAdminNotes(item.admin_notes || '');
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm bg-muted p-3 rounded">{item.message}</p>
                  {item.admin_notes && (
                    <p className="text-sm text-muted-foreground italic">
                      Admin notes: {item.admin_notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View/Review Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Review and add notes to this feedback
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedFeedback.name}</span>
                <div className="flex">{getRatingStars(selectedFeedback.rating)}</div>
              </div>
              {selectedFeedback.email && (
                <p className="text-sm text-muted-foreground">
                  <Mail className="h-3 w-3 inline mr-1" /> {selectedFeedback.email}
                </p>
              )}
              {selectedFeedback.phone && (
                <p className="text-sm text-muted-foreground">
                  <Phone className="h-3 w-3 inline mr-1" /> {selectedFeedback.phone}
                </p>
              )}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{selectedFeedback.message}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea
                  placeholder="Add notes about this feedback..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={reviewFeedback.isPending}
            >
              {selectedFeedback?.is_reviewed ? 'Update Notes' : 'Mark as Reviewed'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteFeedback.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
