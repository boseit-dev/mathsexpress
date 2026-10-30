export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      attempt_questions: {
        Row: {
          attempt_id: string;
          first_try_correct: boolean;
          hints_used: number;
          question_id: string;
          solved_at: string | null;
          tries: number;
        };
        ComputedFields: never;
        Insert: {
          attempt_id: string;
          first_try_correct: boolean;
          hints_used?: number;
          question_id: string;
          solved_at?: string | null;
          tries?: number;
        };
        Update: {
          attempt_id?: string;
          first_try_correct?: boolean;
          hints_used?: number;
          question_id?: string;
          solved_at?: string | null;
          tries?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'attempt_questions_attempt_id_fkey';
            columns: ['attempt_id'];
            isOneToOne: false;
            referencedRelation: 'lesson_attempts';
            referencedColumns: ['id'];
          },
        ];
      };
      class_join_codes: {
        Row: {
          class_id: string;
          code: string;
          created_at: string;
        };
        ComputedFields: never;
        Insert: {
          class_id: string;
          code: string;
          created_at?: string;
        };
        Update: {
          class_id?: string;
          code?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'class_join_codes_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: true;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
        ];
      };
      class_members: {
        Row: {
          class_id: string;
          joined_at: string;
          student_id: string;
          year_level: number;
        };
        ComputedFields: never;
        Insert: {
          class_id: string;
          joined_at?: string;
          student_id: string;
          year_level: number;
        };
        Update: {
          class_id?: string;
          joined_at?: string;
          student_id?: string;
          year_level?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'class_members_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_members_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      class_teachers: {
        Row: {
          added_at: string;
          class_id: string;
          role: Database['public']['Enums']['class_teacher_role'];
          teacher_id: string;
        };
        ComputedFields: never;
        Insert: {
          added_at?: string;
          class_id: string;
          role?: Database['public']['Enums']['class_teacher_role'];
          teacher_id: string;
        };
        Update: {
          added_at?: string;
          class_id?: string;
          role?: Database['public']['Enums']['class_teacher_role'];
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'class_teachers_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'class_teachers_teacher_id_fkey';
            columns: ['teacher_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      classes: {
        Row: {
          created_at: string;
          id: string;
          joining_enabled: boolean;
          name: string;
          students_can_leave: boolean;
          updated_at: string;
          year_level: number;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          joining_enabled?: boolean;
          name: string;
          students_can_leave?: boolean;
          updated_at?: string;
          year_level: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          joining_enabled?: boolean;
          name?: string;
          students_can_leave?: boolean;
          updated_at?: string;
          year_level?: number;
        };
        Relationships: [];
      };
      former_class_members: {
        Row: {
          class_id: string;
          followed_class_level: boolean;
          left_at: string;
          student_id: string;
          year_level: number;
        };
        ComputedFields: never;
        Insert: {
          class_id: string;
          followed_class_level: boolean;
          left_at?: string;
          student_id: string;
          year_level: number;
        };
        Update: {
          class_id?: string;
          followed_class_level?: boolean;
          left_at?: string;
          student_id?: string;
          year_level?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'former_class_members_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'former_class_members_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      learning_content: {
        Row: {
          available: boolean;
          estimated_minutes: number;
          id: string;
          kind: string;
          question_count: number;
          strand: string;
          title: string;
          topic: string;
          year_level: number;
        };
        ComputedFields: never;
        Insert: {
          available?: boolean;
          estimated_minutes: number;
          id: string;
          kind: string;
          question_count: number;
          strand: string;
          title: string;
          topic: string;
          year_level: number;
        };
        Update: {
          available?: boolean;
          estimated_minutes?: number;
          id?: string;
          kind?: string;
          question_count?: number;
          strand?: string;
          title?: string;
          topic?: string;
          year_level?: number;
        };
        Relationships: [];
      };
      learning_questions: {
        Row: {
          answer: number;
          content_id: string;
          position: number;
          question_id: string;
        };
        ComputedFields: never;
        Insert: {
          answer: number;
          content_id: string;
          position: number;
          question_id: string;
        };
        Update: {
          answer?: number;
          content_id?: string;
          position?: number;
          question_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'learning_questions_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'learning_content';
            referencedColumns: ['id'];
          },
        ];
      };
      lesson_attempts: {
        Row: {
          completed_at: string | null;
          content_id: string;
          id: string;
          last_activity_at: string;
          started_at: string;
          student_id: string;
        };
        ComputedFields: never;
        Insert: {
          completed_at?: string | null;
          content_id: string;
          id?: string;
          last_activity_at?: string;
          started_at?: string;
          student_id: string;
        };
        Update: {
          completed_at?: string | null;
          content_id?: string;
          id?: string;
          last_activity_at?: string;
          started_at?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_attempts_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'learning_content';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_attempts_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
          role: Database['public']['Enums']['account_role'];
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          first_name: string;
          id: string;
          last_name: string;
          role: Database['public']['Enums']['account_role'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          role?: Database['public']['Enums']['account_role'];
          updated_at?: string;
        };
        Relationships: [];
      };
      shop_catalogue: {
        Row: {
          active: boolean;
          category: string;
          description: string;
          id: string;
          name: string;
          price: number;
        };
        ComputedFields: never;
        Insert: {
          active?: boolean;
          category: string;
          description: string;
          id: string;
          name: string;
          price: number;
        };
        Update: {
          active?: boolean;
          category?: string;
          description?: string;
          id?: string;
          name?: string;
          price?: number;
        };
        Relationships: [];
      };
      shop_owned: {
        Row: {
          item_id: string;
          purchased_at: string;
          student_id: string;
        };
        ComputedFields: never;
        Insert: {
          item_id: string;
          purchased_at?: string;
          student_id: string;
        };
        Update: {
          item_id?: string;
          purchased_at?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shop_owned_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'shop_catalogue';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shop_owned_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'shop_wallets';
            referencedColumns: ['student_id'];
          },
        ];
      };
      shop_question_awards: {
        Row: {
          created_at: string;
          question_id: string;
          student_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          question_id: string;
          student_id: string;
        };
        Update: {
          created_at?: string;
          question_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shop_question_awards_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'shop_wallets';
            referencedColumns: ['student_id'];
          },
        ];
      };
      shop_transactions: {
        Row: {
          created_at: string;
          delta: number;
          id: number;
          item_id: string | null;
          reason: string;
          student_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          delta: number;
          id?: never;
          item_id?: string | null;
          reason: string;
          student_id: string;
        };
        Update: {
          created_at?: string;
          delta?: number;
          id?: never;
          item_id?: string | null;
          reason?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shop_transactions_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'shop_catalogue';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shop_transactions_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'shop_wallets';
            referencedColumns: ['student_id'];
          },
        ];
      };
      shop_wallets: {
        Row: {
          balance: number;
          created_at: string;
          equipped_frame: string | null;
          equipped_theme: string | null;
          student_id: string;
        };
        ComputedFields: never;
        Insert: {
          balance?: number;
          created_at?: string;
          equipped_frame?: string | null;
          equipped_theme?: string | null;
          student_id: string;
        };
        Update: {
          balance?: number;
          created_at?: string;
          equipped_frame?: string | null;
          equipped_theme?: string | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shop_wallets_equipped_frame_fkey';
            columns: ['equipped_frame'];
            isOneToOne: false;
            referencedRelation: 'shop_catalogue';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shop_wallets_equipped_theme_fkey';
            columns: ['equipped_theme'];
            isOneToOne: false;
            referencedRelation: 'shop_catalogue';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shop_wallets_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      task_students: {
        Row: {
          student_id: string;
          task_id: string;
        };
        ComputedFields: never;
        Insert: {
          student_id: string;
          task_id: string;
        };
        Update: {
          student_id?: string;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_students_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_students_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          assign_to: string;
          class_id: string;
          content_id: string;
          created_at: string;
          created_by: string | null;
          due_at: string;
          id: string;
          instructions: string | null;
          published_at: string | null;
          request_id: string;
          status: string;
          title: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          assign_to: string;
          class_id: string;
          content_id: string;
          created_at?: string;
          created_by?: string | null;
          due_at: string;
          id?: string;
          instructions?: string | null;
          published_at?: string | null;
          request_id: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          assign_to?: string;
          class_id?: string;
          content_id?: string;
          created_at?: string;
          created_by?: string | null;
          due_at?: string;
          id?: string;
          instructions?: string | null;
          published_at?: string | null;
          request_id?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'learning_content';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      year_level_changes: {
        Row: {
          changed_at: string;
          changed_by: string | null;
          class_id: string;
          id: number;
          new_year_level: number;
          previous_year_level: number;
          student_id: string;
        };
        ComputedFields: never;
        Insert: {
          changed_at?: string;
          changed_by?: string | null;
          class_id: string;
          id?: never;
          new_year_level: number;
          previous_year_level: number;
          student_id: string;
        };
        Update: {
          changed_at?: string;
          changed_by?: string | null;
          class_id?: string;
          id?: never;
          new_year_level?: number;
          previous_year_level?: number;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'year_level_changes_changed_by_fkey';
            columns: ['changed_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'year_level_changes_class_id_fkey';
            columns: ['class_id'];
            isOneToOne: false;
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'year_level_changes_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      class_progress: {
        Args: { class_id: string; since?: string; until?: string };
        Returns: Database['public']['CompositeTypes']['student_progress_summary'][];
        SetofOptions: {
          from: '*';
          to: 'student_progress_summary';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      class_students: {
        Args: { class_id: string };
        Returns: Database['public']['CompositeTypes']['class_student'][];
        SetofOptions: {
          from: '*';
          to: 'class_student';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      class_topic_progress: {
        Args: { class_id: string; since?: string; until?: string };
        Returns: Database['public']['CompositeTypes']['topic_progress'][];
        SetofOptions: {
          from: '*';
          to: 'topic_progress';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      complete_profile: {
        Args: {
          first_name: string;
          last_name: string;
          role: Database['public']['Enums']['account_role'];
        };
        Returns: {
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
          role: Database['public']['Enums']['account_role'];
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'profiles';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      create_class: {
        Args: { name: string; year_level: number };
        Returns: Database['public']['CompositeTypes']['teacher_class'];
        SetofOptions: {
          from: '*';
          to: 'teacher_class';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      create_task: {
        Args: {
          class_id: string;
          content_id: string;
          due_at: string;
          instructions?: string;
          publish?: boolean;
          request_id: string;
          student_ids?: string[];
          title: string;
        };
        Returns: Database['public']['CompositeTypes']['teacher_task'];
        SetofOptions: {
          from: '*';
          to: 'teacher_task';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      custom_access_token_hook: { Args: { event: Json }; Returns: Json };
      delete_task: { Args: { task_id: string }; Returns: undefined };
      email_sign_in_age: { Args: Record<PropertyKey, never>; Returns: number };
      get_task: {
        Args: { task_id: string };
        Returns: Database['public']['CompositeTypes']['teacher_task'];
        SetofOptions: {
          from: '*';
          to: 'teacher_task';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      get_teacher_class: {
        Args: { class_id: string };
        Returns: Database['public']['CompositeTypes']['teacher_class'];
        SetofOptions: {
          from: '*';
          to: 'teacher_class';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      join_class: {
        Args: { code: string };
        Returns: Database['public']['CompositeTypes']['student_class'];
        SetofOptions: {
          from: '*';
          to: 'student_class';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      learning_catalogue: {
        Args: Record<PropertyKey, never>;
        Returns: Database['public']['CompositeTypes']['learning_item'][];
        SetofOptions: {
          from: '*';
          to: 'learning_item';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      leave_class: { Args: { class_id: string }; Returns: undefined };
      my_classes: {
        Args: Record<PropertyKey, never>;
        Returns: Database['public']['CompositeTypes']['student_class'][];
        SetofOptions: {
          from: '*';
          to: 'student_class';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      my_tasks: {
        Args: Record<PropertyKey, never>;
        Returns: Database['public']['CompositeTypes']['student_task'][];
        SetofOptions: {
          from: '*';
          to: 'student_task';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      profile_session_is_active: { Args: Record<PropertyKey, never>; Returns: boolean };
      publish_task: {
        Args: { task_id: string };
        Returns: Database['public']['CompositeTypes']['teacher_task'];
        SetofOptions: {
          from: '*';
          to: 'teacher_task';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      recent_completions: {
        Args: { max_rows?: number };
        Returns: Database['public']['CompositeTypes']['recent_completion'][];
        SetofOptions: {
          from: '*';
          to: 'recent_completion';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      record_answer: {
        Args: { answer: string; attempt_id: string; hints_used?: number; question_id: string };
        Returns: Json;
      };
      regenerate_join_code: { Args: { class_id: string }; Returns: string };
      remove_student: { Args: { class_id: string; student_id: string }; Returns: undefined };
      set_student_year_level: {
        Args: { class_id: string; student_id: string; year_level: number };
        Returns: Database['public']['CompositeTypes']['class_student'];
        SetofOptions: {
          from: '*';
          to: 'class_student';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      set_task_due_date: {
        Args: { due_at: string; task_id: string };
        Returns: Database['public']['CompositeTypes']['teacher_task'];
        SetofOptions: {
          from: '*';
          to: 'teacher_task';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      shop_award_answer: { Args: { answer: string; question_id: string }; Returns: Json };
      shop_buy: { Args: { item_id: string }; Returns: Json };
      shop_equip: { Args: { category: string; item_id?: string }; Returns: Json };
      shop_state: { Args: Record<PropertyKey, never>; Returns: Json };
      start_lesson_attempt: { Args: { content_id: string }; Returns: string };
      student_results: {
        Args: { class_id: string; since?: string; student_id: string; until?: string };
        Returns: Database['public']['CompositeTypes']['student_attempt_result'][];
        SetofOptions: {
          from: '*';
          to: 'student_attempt_result';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      task_chosen_students: { Args: { task_id: string }; Returns: string[] };
      task_results: {
        Args: { task_id: string };
        Returns: Database['public']['CompositeTypes']['task_student_result'][];
        SetofOptions: {
          from: '*';
          to: 'task_student_result';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      teacher_classes: {
        Args: Record<PropertyKey, never>;
        Returns: Database['public']['CompositeTypes']['teacher_class'][];
        SetofOptions: {
          from: '*';
          to: 'teacher_class';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      teacher_tasks: {
        Args: { class_id?: string };
        Returns: Database['public']['CompositeTypes']['teacher_task'][];
        SetofOptions: {
          from: '*';
          to: 'teacher_task';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      update_class: {
        Args: {
          class_id: string;
          joining_enabled: boolean;
          name: string;
          students_can_leave: boolean;
          year_level: number;
        };
        Returns: Database['public']['CompositeTypes']['teacher_class'];
        SetofOptions: {
          from: '*';
          to: 'teacher_class';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      update_my_name: {
        Args: { first_name: string; last_name: string };
        Returns: {
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
          role: Database['public']['Enums']['account_role'];
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'profiles';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      account_role: 'student' | 'teacher';
      class_teacher_role: 'owner' | 'co_teacher';
      task_status: 'not_started' | 'in_progress' | 'completed';
    };
    CompositeTypes: {
      class_student: {
        student_id: string | null;
        first_name: string | null;
        last_name: string | null;
        year_level: number | null;
        joined_at: string | null;
      };
      learning_item: {
        id: string | null;
        kind: string | null;
        title: string | null;
        strand: string | null;
        topic: string | null;
        year_level: number | null;
        question_count: number | null;
        estimated_minutes: number | null;
      };
      recent_completion: {
        student_id: string | null;
        first_name: string | null;
        last_name: string | null;
        class_id: string | null;
        class_name: string | null;
        content_title: string | null;
        completed_at: string | null;
        question_count: number | null;
        first_try_correct: number | null;
      };
      student_attempt_result: {
        attempt_id: string | null;
        content_id: string | null;
        content_title: string | null;
        strand: string | null;
        topic: string | null;
        started_at: string | null;
        last_activity_at: string | null;
        completed_at: string | null;
        question_count: number | null;
        questions_answered: number | null;
        first_try_correct: number | null;
        hints_used: number | null;
      };
      student_class: {
        class_id: string | null;
        class_name: string | null;
        class_year_level: number | null;
        my_year_level: number | null;
        teacher_name: string | null;
        students_can_leave: boolean | null;
        joined_at: string | null;
      };
      student_progress_summary: {
        student_id: string | null;
        first_name: string | null;
        last_name: string | null;
        year_level: number | null;
        lessons_completed: number | null;
        questions_answered: number | null;
        first_try_correct: number | null;
        hints_used: number | null;
        tasks_assigned: number | null;
        tasks_completed: number | null;
        last_active_at: string | null;
      };
      student_task: {
        id: string | null;
        class_id: string | null;
        class_name: string | null;
        title: string | null;
        instructions: string | null;
        content_id: string | null;
        content_title: string | null;
        content_kind: string | null;
        topic: string | null;
        question_count: number | null;
        estimated_minutes: number | null;
        due_at: string | null;
        published_at: string | null;
        status: Database['public']['Enums']['task_status'] | null;
        completed_at: string | null;
        questions_solved: number | null;
      };
      task_student_result: {
        student_id: string | null;
        first_name: string | null;
        last_name: string | null;
        status: Database['public']['Enums']['task_status'] | null;
        completed_at: string | null;
        last_activity_at: string | null;
        questions_solved: number | null;
        first_try_correct: number | null;
        question_count: number | null;
      };
      teacher_class: {
        id: string | null;
        name: string | null;
        year_level: number | null;
        join_code: string | null;
        joining_enabled: boolean | null;
        students_can_leave: boolean | null;
        student_count: number | null;
        created_at: string | null;
      };
      teacher_task: {
        id: string | null;
        class_id: string | null;
        class_name: string | null;
        title: string | null;
        instructions: string | null;
        content_id: string | null;
        content_title: string | null;
        content_kind: string | null;
        status: string | null;
        assign_to: string | null;
        due_at: string | null;
        created_at: string | null;
        published_at: string | null;
        assigned_count: number | null;
        completed_count: number | null;
        in_progress_count: number | null;
      };
      topic_progress: {
        content_id: string | null;
        content_title: string | null;
        strand: string | null;
        topic: string | null;
        class_size: number | null;
        students_started: number | null;
        students_completed: number | null;
        questions_answered: number | null;
        first_try_correct: number | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_role: ['student', 'teacher'],
      class_teacher_role: ['owner', 'co_teacher'],
      task_status: ['not_started', 'in_progress', 'completed'],
    },
  },
} as const;
