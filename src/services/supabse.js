import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://orcqfhtkbdhnkybivpfy.supabase.co'
const supabaseKey = 'sb_publishable_Krm9u_YOw0tPQrwf5FBcVA_nVsJhI5n'

export const supabase = createClient(supabaseUrl, supabaseKey)