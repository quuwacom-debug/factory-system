-- Create Workers Table
CREATE TABLE public.workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    photo_url TEXT,
    join_date DATE NOT NULL,
    salary NUMERIC,
    role TEXT,
    barcode_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Attendance Table
CREATE TABLE public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES public.workers(id) NOT NULL,
    date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    overtime_hours NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Allow public read/write for now for vibe coding demo, 
-- in real app restrict this!)
CREATE POLICY "Allow all access to workers" ON public.workers FOR ALL USING (true);
CREATE POLICY "Allow all access to attendance" ON public.attendance FOR ALL USING (true);
