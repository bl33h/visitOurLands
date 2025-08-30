import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    "https://nfxfnlnnuzpeflfaqxzc.supabase.co/", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meGZubG5udXpwZWZsZmFxeHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NzIyOTcsImV4cCI6MjA3MjE0ODI5N30.CbjcBuB05FKYctTtnCZvsFxPDVtGDFHAg29aiqOQNoQ",
)