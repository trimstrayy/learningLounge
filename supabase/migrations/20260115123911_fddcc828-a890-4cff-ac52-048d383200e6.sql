-- Create live_sessions table to track active class sessions
CREATE TABLE public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL,
  test_type text NOT NULL,
  book_id text NOT NULL,
  test_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  current_section integer DEFAULT 1,
  audio_state jsonb DEFAULT '{"playing": false, "currentTime": 0}'::jsonb,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);

-- Create live_session_participants table
CREATE TABLE public.live_session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, student_id)
);

-- Enable RLS
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_session_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for live_sessions
CREATE POLICY "Teachers can create live sessions in their classrooms"
ON public.live_sessions FOR INSERT
WITH CHECK (is_classroom_teacher(auth.uid(), classroom_id) AND teacher_id = auth.uid());

CREATE POLICY "Teachers can update their live sessions"
ON public.live_sessions FOR UPDATE
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can view their live sessions"
ON public.live_sessions FOR SELECT
USING (teacher_id = auth.uid());

CREATE POLICY "Students can view live sessions in their classrooms"
ON public.live_sessions FOR SELECT
USING (is_classroom_member(auth.uid(), classroom_id));

CREATE POLICY "Teachers can delete their live sessions"
ON public.live_sessions FOR DELETE
USING (teacher_id = auth.uid());

-- RLS policies for live_session_participants
CREATE POLICY "Students can join live sessions in their classrooms"
ON public.live_session_participants FOR INSERT
WITH CHECK (
  student_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.live_sessions ls
    WHERE ls.id = session_id AND is_classroom_member(auth.uid(), ls.classroom_id)
  )
);

CREATE POLICY "Students can view their own participation"
ON public.live_session_participants FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Teachers can view participants in their sessions"
ON public.live_session_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.live_sessions ls
    WHERE ls.id = session_id AND ls.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can leave sessions"
ON public.live_session_participants FOR DELETE
USING (student_id = auth.uid());

-- Enable realtime for live_sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;