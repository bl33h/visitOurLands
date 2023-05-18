import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    "https://cchcbbjgpcwuugrjedsl.supabase.co/", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaGNiYmpncGN3dXVncmplZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMzMjk2NDEsImV4cCI6MTk5ODkwNTY0MX0.AehLrTlHHIt04_0Xw4B6iEO3EKXpG9H5EG2NiKCZtAw",
)