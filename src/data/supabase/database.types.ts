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
    };
    CompositeTypes: {
      class_student: {
        student_id: string | null;
        first_name: string | null;
        last_name: string | null;
        year_level: number | null;
        joined_at: string | null;
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
    },
  },
} as const;
