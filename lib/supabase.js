import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lyqllkzfpjhrtofxfyhe.supabase.co'
const supabaseKey = 'sb_publishable_cLEWkGh1UjbnfzVw7svQPg_oaW0XZx9'

export const supabase = createClient(supabaseUrl, supabaseKey)