export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      app_settings: {
        Row: { id: string; lock_submissions: boolean; updated_at: string };
        Insert: { id?: string; lock_submissions?: boolean; updated_at?: string };
        Update: { id?: string; lock_submissions?: boolean; updated_at?: string };
      };
      results: {
        Row: { id: string; question_number: number; correct_answer: string; updated_at: string };
        Insert: { id?: string; question_number: number; correct_answer: string; updated_at?: string };
        Update: { id?: string; question_number?: number; correct_answer?: string; updated_at?: string };
      };
      predictions: {
        Row: {
          id: string;
          guest_name: string;
          q1: string | null;
          q2: string | null;
          q3: string | null;
          q4: string | null;
          q5: string | null;
          q6: string | null;
          q7: string | null;
          q8: string | null;
          q9: string | null;
          q10: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          guest_name: string;
          q1?: string | null;
          q2?: string | null;
          q3?: string | null;
          q4?: string | null;
          q5?: string | null;
          q6?: string | null;
          q7?: string | null;
          q8?: string | null;
          q9?: string | null;
          q10?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          guest_name?: string;
          q1?: string | null;
          q2?: string | null;
          q3?: string | null;
          q4?: string | null;
          q5?: string | null;
          q6?: string | null;
          q7?: string | null;
          q8?: string | null;
          q9?: string | null;
          q10?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type PredictionRow = Database["public"]["Tables"]["predictions"]["Row"];
export type ResultsRow = Database["public"]["Tables"]["results"]["Row"];
export type AppSettingsRow = Database["public"]["Tables"]["app_settings"]["Row"];
