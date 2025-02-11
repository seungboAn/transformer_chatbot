import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function for chat interactions
export const sendMessageToBot = async (message) => {
  try {
    // Call Supabase Function for bot response
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { message },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error calling chat function:', error);
    throw error;
  }
}; 