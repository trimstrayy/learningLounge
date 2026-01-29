# Feedback System Documentation

## Overview
A production-ready feedback system that allows users to provide ratings and feedback about the Learning Lounge IELTS platform. The system includes automatic prompting with configurable intervals and a manual feedback button.

## Features

### 1. **Automatic Feedback Prompts**
- Modal appears automatically 30 seconds after page load
- Reappears every 24 hours (configurable)
- Tracks display frequency in localStorage
- Non-intrusive - users can dismiss anytime

### 2. **Floating Feedback Button**
- Always accessible via a floating button (bottom-right corner)
- Allows users to provide feedback at any time
- Responsive design with tooltip

### 3. **Comprehensive Feedback Form**
- **Rating System**: 1-5 star rating (required)
  - Visual feedback with star icons
  - Hover effects for better UX
  - Descriptive labels (Excellent, Good, Average, etc.)

- **User Information**:
  - Name (required)
  - Email (optional)
  - Phone/Contact (optional)
  - Auto-fills for logged-in users

- **Feedback Message**: Rich text area for detailed feedback (required)

### 4. **Data Storage**
- All feedback stored in Supabase database
- Includes user association (if authenticated)
- Timestamps for tracking
- Row Level Security (RLS) enabled

### 5. **User Experience**
- Responsive design (mobile & desktop)
- Dark mode compatible
- Form validation with helpful error messages
- Success notifications
- Loading states during submission

## Implementation Details

### Files Created

1. **Database Migration**: `supabase/migrations/20260129000000_create_feedback_table.sql`
   - Creates feedback table with proper schema
   - Implements RLS policies
   - Adds indexes for performance
   - Includes audit timestamps

2. **Components**:
   - `FeedbackModal.tsx`: Main feedback form modal
   - `FeedbackButton.tsx`: Floating action button

3. **Hooks**:
   - `useFeedbackModal.ts`: Manages modal state and timing logic

4. **Integration**: 
   - Updated `App.tsx` to include feedback system globally

### Database Schema

```sql
feedback (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  rating INTEGER (1-5),
  user_id UUID (references auth.users),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Configuration

Timing settings in `useFeedbackModal.ts`:

```typescript
FEEDBACK_DELAY_MS = 30000;        // 30 seconds after page load
FEEDBACK_COOLDOWN_MS = 86400000;  // 24 hours between prompts
```

You can adjust these values to change:
- Initial delay before first prompt
- Cooldown period between subsequent prompts

### LocalStorage Keys

- `learning-lounge-feedback`: Stores feedback state
  ```json
  {
    "lastShown": 1234567890,  // timestamp
    "totalShown": 5,           // total times shown
    "dismissed": 3             // times dismissed
  }
  ```

## Setup Instructions

### 1. Apply Database Migration

```bash
cd supabase
npx supabase db reset  # if in development
# OR
npx supabase db push   # for production
```

### 2. Install Dependencies (if needed)

All dependencies should already be in your project:
- `@supabase/supabase-js`
- `lucide-react`
- shadcn/ui components (Dialog, Button, Input, etc.)

### 3. Environment Variables

Ensure these are set (should already be configured):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## Usage

### For Users

1. **Automatic Prompt**: Wait 30 seconds on any page
2. **Manual Feedback**: Click the floating feedback button (bottom-right)
3. Fill out the form and submit

### For Developers

**To customize appearance**:
- Edit `FeedbackModal.tsx` for form styling
- Edit `FeedbackButton.tsx` for button styling

**To change timing**:
- Modify constants in `useFeedbackModal.ts`

**To add feedback button to specific pages only**:
- Instead of adding to App.tsx, import and use in specific page components

**To disable auto-prompt** (keep only manual button):
- Comment out the useEffect in `useFeedbackModal.ts`

## Viewing Feedback Data

### Option 1: Supabase Dashboard
1. Go to your Supabase project
2. Navigate to Table Editor
3. Select `feedback` table
4. View all submissions with filters and sorting

### Option 2: SQL Query
```sql
SELECT 
  name,
  email,
  rating,
  message,
  created_at,
  (SELECT email FROM auth.users WHERE id = feedback.user_id) as user_email
FROM feedback
ORDER BY created_at DESC;
```

### Option 3: Export Data
```sql
COPY (
  SELECT * FROM feedback
  ORDER BY created_at DESC
) TO '/tmp/feedback.csv' WITH CSV HEADER;
```

## Analytics Queries

**Average Rating**:
```sql
SELECT AVG(rating)::numeric(10,2) as avg_rating,
       COUNT(*) as total_feedback
FROM feedback;
```

**Rating Distribution**:
```sql
SELECT rating, COUNT(*) as count
FROM feedback
GROUP BY rating
ORDER BY rating DESC;
```

**Recent Feedback**:
```sql
SELECT name, rating, message, created_at
FROM feedback
ORDER BY created_at DESC
LIMIT 10;
```

**User Engagement**:
```sql
SELECT 
  COUNT(DISTINCT user_id) as authenticated_users,
  COUNT(*) FILTER (WHERE user_id IS NULL) as anonymous_feedback,
  COUNT(*) as total_feedback
FROM feedback;
```

## Security Features

1. **Row Level Security (RLS)**:
   - Anyone can submit feedback (INSERT)
   - Users can only view their own feedback
   - Admins need separate policy (customize as needed)

2. **Data Validation**:
   - Client-side validation before submission
   - Database constraints (rating 1-5, NOT NULL fields)
   - SQL injection protection via Supabase client

3. **Privacy**:
   - Optional contact fields
   - User ID stored only if authenticated
   - Compliant with data protection regulations

## Customization Examples

### Change Prompt Frequency to 3 Days:
```typescript
// In useFeedbackModal.ts
const FEEDBACK_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;
```

### Show Only After 3 Page Views:
```typescript
// Add to useFeedbackModal.ts
const [pageViews, setPageViews] = useState(0);

useEffect(() => {
  const views = parseInt(localStorage.getItem('pageViews') || '0') + 1;
  localStorage.setItem('pageViews', views.toString());
  setPageViews(views);
  
  if (views >= 3) {
    // Show feedback modal logic
  }
}, []);
```

### Add Category/Type Selection:
Add to FeedbackModal.tsx:
```typescript
const [category, setCategory] = useState('');

// In form:
<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select feedback type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="bug">Bug Report</SelectItem>
    <SelectItem value="feature">Feature Request</SelectItem>
    <SelectItem value="general">General Feedback</SelectItem>
  </SelectContent>
</Select>

// Update database schema to include category column
```

## Troubleshooting

### Modal Not Appearing
1. Check browser console for errors
2. Clear localStorage: `localStorage.removeItem('learning-lounge-feedback')`
3. Ensure 30 seconds have passed since page load
4. Check if cooldown period has expired

### Feedback Not Saving
1. Check Supabase connection in console
2. Verify RLS policies in Supabase dashboard
3. Check network tab for API errors
4. Ensure VITE_SUPABASE_* env vars are set

### Button Not Visible
1. Check z-index conflicts with other floating elements
2. Ensure TooltipProvider is wrapping the app
3. Check if button is hidden on mobile (responsive classes)

## Future Enhancements

Potential additions you could implement:

1. **Admin Dashboard**: View and manage feedback in-app
2. **Email Notifications**: Alert admins of new feedback
3. **Sentiment Analysis**: Auto-categorize feedback sentiment
4. **Response System**: Reply to user feedback
5. **Export Feature**: Download feedback as CSV/Excel
6. **Analytics Dashboard**: Visual charts and statistics
7. **Feedback Categories**: Bug, Feature, Complaint, Praise
8. **Screenshot Attachment**: Allow users to attach images
9. **Status Tracking**: Mark feedback as reviewed/resolved
10. **Public Roadmap**: Show which features are being worked on

## Best Practices

1. **Respond to Feedback**: Acknowledge and act on user feedback
2. **Monitor Regularly**: Check new feedback daily
3. **Close the Loop**: Let users know when their feedback is implemented
4. **Keep Forms Short**: Only ask essential questions
5. **Make it Easy**: Multiple entry points (button, auto-prompt)
6. **Respect Privacy**: Honor user preferences, allow anonymous feedback
7. **Track Metrics**: Monitor response rate and average rating trends
8. **A/B Testing**: Test different prompt timings and messages

## Support

For questions or issues:
1. Check this documentation
2. Review Supabase logs
3. Check browser console for errors
4. Verify database schema matches migration

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
