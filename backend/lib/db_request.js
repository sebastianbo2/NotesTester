// lib/dbHelpers.js
import { supabase } from './supabase.js';

export async function getById(table, id) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  return data; // full row object or null
}
