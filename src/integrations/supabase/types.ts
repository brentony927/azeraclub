export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          amount: number
          approved_at: string | null
          created_at: string | null
          id: string
          paid_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          affiliate_id: string
          amount: number
          approved_at?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          affiliate_id?: string
          amount?: number
          approved_at?: string | null
          created_at?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_leads: {
        Row: {
          created_at: string | null
          id: string
          purchased_at: string | null
          referrer_id: string
          signed_up_at: string | null
          user_id: string
          user_name: string | null
          user_plan: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          purchased_at?: string | null
          referrer_id: string
          signed_up_at?: string | null
          user_id: string
          user_name?: string | null
          user_plan?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          purchased_at?: string | null
          referrer_id?: string
          signed_up_at?: string | null
          user_id?: string
          user_name?: string | null
          user_plan?: string | null
        }
        Relationships: []
      }
      affiliate_profiles: {
        Row: {
          affiliate_id: string
          commission_rate: number | null
          created_at: string | null
          enabled: boolean | null
          id: string
          level: string | null
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean | null
          user_id: string
        }
        Insert: {
          affiliate_id: string
          commission_rate?: number | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          level?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean | null
          user_id: string
        }
        Update: {
          affiliate_id?: string
          commission_rate?: number | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          level?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      affiliate_requests: {
        Row: {
          audience: string | null
          created_at: string | null
          full_name: string
          id: string
          instagram: string | null
          status: string
          strategy: string | null
          tiktok: string | null
          twitter: string | null
          updated_at: string | null
          user_id: string
          youtube: string | null
        }
        Insert: {
          audience?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          instagram?: string | null
          status?: string
          strategy?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id: string
          youtube?: string | null
        }
        Update: {
          audience?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          instagram?: string | null
          status?: string
          strategy?: string | null
          tiktok?: string | null
          twitter?: string | null
          updated_at?: string | null
          user_id?: string
          youtube?: string | null
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          mood: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_memories: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          source_conversation_id: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          source_conversation_id?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          source_conversation_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_memories_source_conversation_id_fkey"
            columns: ["source_conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          created_at: string | null
          current_day: number | null
          description: string | null
          duration_days: number | null
          id: string
          started_at: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_day?: number | null
          description?: string | null
          duration_days?: number | null
          id?: string
          started_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_day?: number | null
          description?: string | null
          duration_days?: number | null
          id?: string
          started_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      elite_events: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          event_date: string | null
          id: string
          location: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          title?: string
        }
        Relationships: []
      }
      event_invitations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "elite_events"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          category: string
          created_at: string
          date: string | null
          description: string | null
          id: string
          image: string | null
          location: string | null
          saved: boolean
          time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location?: string | null
          saved?: boolean
          time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location?: string | null
          saved?: boolean
          time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      founder_connections: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          status: string
          to_user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          status?: string
          to_user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          status?: string
          to_user_id?: string
        }
        Relationships: []
      }
      founder_locations: {
        Row: {
          id: string
          latitude: number | null
          longitude: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          latitude?: number | null
          longitude?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          latitude?: number | null
          longitude?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      founder_messages: {
        Row: {
          content: string
          created_at: string
          from_user_id: string
          id: string
          opportunity_id: string | null
          read: boolean | null
          to_user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          from_user_id: string
          id?: string
          opportunity_id?: string | null
          read?: boolean | null
          to_user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          from_user_id?: string
          id?: string
          opportunity_id?: string | null
          read?: boolean | null
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_messages_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "founder_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_notifications: {
        Row: {
          action_url: string | null
          body: string | null
          created_at: string
          id: string
          read: boolean
          related_user_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          related_user_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          related_user_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      founder_opportunities: {
        Row: {
          created_at: string
          description: string | null
          equity_available: boolean | null
          id: string
          looking_for: string[] | null
          media_type: string | null
          media_urls: string[] | null
          project: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          equity_available?: boolean | null
          id?: string
          looking_for?: string[] | null
          media_type?: string | null
          media_urls?: string[] | null
          project?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          equity_available?: boolean | null
          id?: string
          looking_for?: string[] | null
          media_type?: string | null
          media_urls?: string[] | null
          project?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      founder_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "founder_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "founder_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      founder_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          media_urls: string[] | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_urls?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      founder_profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          building: string | null
          city: string | null
          commitment: string | null
          continent: string | null
          country: string | null
          created_at: string
          id: string
          industry: string[] | null
          interests: string[] | null
          is_published: boolean | null
          is_site_owner: boolean
          is_verified: boolean | null
          looking_for: string[] | null
          name: string
          profile_views: number | null
          reputation_score: number | null
          skills: string[] | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          building?: string | null
          city?: string | null
          commitment?: string | null
          continent?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry?: string[] | null
          interests?: string[] | null
          is_published?: boolean | null
          is_site_owner?: boolean
          is_verified?: boolean | null
          looking_for?: string[] | null
          name: string
          profile_views?: number | null
          reputation_score?: number | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          building?: string | null
          city?: string | null
          commitment?: string | null
          continent?: string | null
          country?: string | null
          created_at?: string
          id?: string
          industry?: string[] | null
          interests?: string[] | null
          is_published?: boolean | null
          is_site_owner?: boolean
          is_verified?: boolean | null
          looking_for?: string[] | null
          name?: string
          profile_views?: number | null
          reputation_score?: number | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      founder_scores: {
        Row: {
          activity_points: number
          id: string
          influence_points: number
          level: string
          network_points: number
          profile_points: number
          project_points: number
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_points?: number
          id?: string
          influence_points?: number
          level?: string
          network_points?: number
          profile_points?: number
          project_points?: number
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_points?: number
          id?: string
          influence_points?: number
          level?: string
          network_points?: number
          profile_points?: number
          project_points?: number
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_plans: {
        Row: {
          breakdown: string
          created_at: string | null
          goal: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          breakdown: string
          created_at?: string | null
          goal: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          breakdown?: string
          created_at?: string | null
          goal?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_messages: {
        Row: {
          content: string
          created_at: string
          group_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          created_at: string | null
          frequency: string | null
          id: string
          last_checked: string | null
          status: string | null
          streak: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          frequency?: string | null
          id?: string
          last_checked?: string | null
          status?: string | null
          streak?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          frequency?: string | null
          id?: string
          last_checked?: string | null
          status?: string | null
          streak?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_appointments: {
        Row: {
          contact: string | null
          created_at: string
          date: string | null
          id: string
          location: string | null
          provider: string
          specialty: string | null
          time: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          date?: string | null
          id?: string
          location?: string | null
          provider: string
          specialty?: string | null
          time?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          date?: string | null
          id?: string
          location?: string | null
          provider?: string
          specialty?: string | null
          time?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          ai_response: string | null
          content: string
          created_at: string | null
          id: string
          mood: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_response?: string | null
          content: string
          created_at?: string | null
          id?: string
          mood?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_response?: string | null
          content?: string
          created_at?: string | null
          id?: string
          mood?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          candle_message: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          memory_date: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          candle_message?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          memory_date?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          candle_message?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          memory_date?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      message_groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      objectives: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      opportunity_alerts: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          industries: string[] | null
          last_alert_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          industries?: string[] | null
          last_alert_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          industries?: string[] | null
          last_alert_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pinned_conversations: {
        Row: {
          created_at: string
          id: string
          pinned_group_id: string | null
          pinned_user_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pinned_group_id?: string | null
          pinned_user_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pinned_group_id?: string | null
          pinned_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pinned_conversations_pinned_group_id_fkey"
            columns: ["pinned_group_id"]
            isOneToOne: false
            referencedRelation: "message_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_visits: {
        Row: {
          id: string
          profile_user_id: string
          visit_date: string
          visited_at: string
          visitor_user_id: string
        }
        Insert: {
          id?: string
          profile_user_id: string
          visit_date?: string
          visited_at?: string
          visitor_user_id: string
        }
        Update: {
          id?: string
          profile_user_id?: string
          visit_date?: string
          visited_at?: string
          visitor_user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          has_seen_onboarding: boolean
          id: string
          interests: string[] | null
          location: string | null
          phone: string | null
          preferred_language: string | null
          profession: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          has_seen_onboarding?: boolean
          id?: string
          interests?: string[] | null
          location?: string | null
          phone?: string | null
          preferred_language?: string | null
          profession?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          has_seen_onboarding?: boolean
          id?: string
          interests?: string[] | null
          location?: string | null
          phone?: string | null
          preferred_language?: string | null
          profession?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_tasks: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          ai_structure: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_structure?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_structure?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          image: string | null
          monthly_expense: number | null
          name: string
          staff: number | null
          type: string | null
          updated_at: string
          user_id: string
          valuation: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image?: string | null
          monthly_expense?: number | null
          name: string
          staff?: number | null
          type?: string | null
          updated_at?: string
          user_id: string
          valuation?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image?: string | null
          monthly_expense?: number | null
          name?: string
          staff?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
          valuation?: number | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referrer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referrer_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referrer_id?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_insights: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_plans: {
        Row: {
          created_at: string | null
          id: string
          plan_content: string
          skill: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_content: string
          skill: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_content?: string
          skill?: string
          user_id?: string
        }
        Relationships: []
      }
      social_events: {
        Row: {
          attendees: number | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          location: string | null
          rsvp: string
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: number | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          rsvp?: string
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: number | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          rsvp?: string
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          id: string
          status: string
          time: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          status?: string
          time?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          status?: string
          time?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trend_scans: {
        Row: {
          ai_insight: string | null
          category: string | null
          created_at: string
          id: string
          link: string | null
          source: string | null
          summary: string | null
          title: string
          user_id: string
        }
        Insert: {
          ai_insight?: string | null
          category?: string | null
          created_at?: string
          id?: string
          link?: string | null
          source?: string | null
          summary?: string | null
          title: string
          user_id: string
        }
        Update: {
          ai_insight?: string | null
          category?: string | null
          created_at?: string
          id?: string
          link?: string | null
          source?: string | null
          summary?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          country: string | null
          created_at: string
          dates: string | null
          destination: string
          hotel: string | null
          id: string
          image: string | null
          status: string
          transport: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          dates?: string | null
          destination: string
          hotel?: string | null
          id?: string
          image?: string | null
          status?: string
          transport?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          dates?: string | null
          destination?: string
          hotel?: string | null
          id?: string
          image?: string | null
          status?: string
          transport?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_key: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_key: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_key?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      user_moderation: {
        Row: {
          action: string
          created_at: string
          expires_at: string | null
          id: string
          moderator_id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          expires_at?: string | null
          id?: string
          moderator_id: string
          reason?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          moderator_id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          id: string
          plan: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reported_user_id: string
          reporter_id: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reported_user_id: string
          reporter_id: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reported_user_id?: string
          reporter_id?: string
        }
        Relationships: []
      }
      venture_chat: {
        Row: {
          content: string
          created_at: string
          id: string
          is_ai: boolean
          user_id: string
          venture_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_ai?: boolean
          user_id: string
          venture_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_ai?: boolean
          user_id?: string
          venture_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venture_chat_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      venture_members: {
        Row: {
          id: string
          invited_at: string
          role: string
          status: string
          user_id: string
          venture_id: string
        }
        Insert: {
          id?: string
          invited_at?: string
          role?: string
          status?: string
          user_id: string
          venture_id: string
        }
        Update: {
          id?: string
          invited_at?: string
          role?: string
          status?: string
          user_id?: string
          venture_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venture_members_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      venture_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          venture_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
          venture_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          venture_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venture_notes_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      venture_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          status: string
          title: string
          user_id: string
          venture_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          title: string
          user_id: string
          venture_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          title?: string
          user_id?: string
          venture_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venture_tasks_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      ventures: {
        Row: {
          ai_roadmap: string | null
          business_model: string | null
          created_at: string
          goal: string | null
          id: string
          industry: string | null
          name: string
          problem: string | null
          solution: string | null
          status: string
          target_market: string | null
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_roadmap?: string | null
          business_model?: string | null
          created_at?: string
          goal?: string | null
          id?: string
          industry?: string | null
          name: string
          problem?: string | null
          solution?: string | null
          status?: string
          target_market?: string | null
          total_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_roadmap?: string | null
          business_model?: string | null
          created_at?: string
          goal?: string | null
          id?: string
          industry?: string | null
          name?: string
          problem?: string | null
          solution?: string | null
          status?: string
          target_market?: string | null
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weekly_message_limits: {
        Row: {
          id: string
          message_count: number
          user_id: string
          week_start: string
        }
        Insert: {
          id?: string
          message_count?: number
          user_id: string
          week_start: string
        }
        Update: {
          id?: string
          message_count?: number
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_rounded_coordinates: {
        Args: { p_user_id: string }
        Returns: {
          latitude: number
          longitude: number
        }[]
      }
      is_group_admin: {
        Args: { p_group_id: string; p_user_id: string }
        Returns: boolean
      }
      is_group_creator: {
        Args: { p_group_id: string; p_user_id: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { p_group_id: string; p_user_id: string }
        Returns: boolean
      }
      is_site_owner: { Args: { p_user_id: string }; Returns: boolean }
      is_venture_member: {
        Args: { p_user_id: string; p_venture_id: string }
        Returns: boolean
      }
      is_venture_owner: {
        Args: { p_user_id: string; p_venture_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
