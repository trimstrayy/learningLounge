import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FeedbackButtonProps {
  onClick: () => void;
  className?: string;
}

export const FeedbackButton = ({ onClick, className = '' }: FeedbackButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          size="icon"
          variant="outline"
          className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 ${className}`}
          aria-label="Give Feedback"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Give us your feedback</p>
      </TooltipContent>
    </Tooltip>
  );
};
