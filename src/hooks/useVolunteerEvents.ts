import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VolunteerEvent {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  max_volunteers: number;
  current_volunteers: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image_url?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  organizations?: {
    name: string;
    user_id: string;
  };
}

export interface VolunteerRegistration {
  id: string;
  event_id: string;
  user_id: string;
  age: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  // Joined data
  profiles?: {
    name: string;
    email: string;
  };
}

export const useVolunteerEvents = () => {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [registrations, setRegistrations] = useState<VolunteerRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('volunteer_events')
      .select(`
        *,
        organizations (name, user_id)
      `)
      .order('event_date', { ascending: true });

    if (!error && data) {
      setEvents(data as VolunteerEvent[]);
    }
    setLoading(false);
  };

  const fetchRegistrations = async (eventId?: string) => {
    let query = supabase
      .from('volunteer_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;

    if (!error && data) {
      setRegistrations(data as unknown as VolunteerRegistration[]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (event: Omit<VolunteerEvent, 'id' | 'organization_id' | 'current_volunteers' | 'status' | 'created_at' | 'updated_at' | 'organizations'>, organizationId: string) => {
    const { error } = await supabase
      .from('volunteer_events')
      .insert({
        title: event.title,
        description: event.description,
        location: event.location,
        event_date: event.event_date,
        event_time: event.event_time,
        max_volunteers: event.max_volunteers,
        image_url: event.image_url,
        organization_id: organizationId,
        current_volunteers: 0,
        status: 'upcoming',
      });
    
    if (!error) await fetchEvents();
    return { error };
  };

  const updateEvent = async (id: string, updates: Partial<VolunteerEvent>) => {
    const { error } = await supabase
      .from('volunteer_events')
      .update(updates)
      .eq('id', id);
    
    if (!error) await fetchEvents();
    return { error };
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from('volunteer_events')
      .delete()
      .eq('id', id);
    
    if (!error) await fetchEvents();
    return { error };
  };

  const registerForEvent = async (eventId: string, age: number, message?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('volunteer_registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        age,
        message,
        status: 'pending',
      });
    
    if (!error) await fetchEvents();
    return { error };
  };

  const approveRegistration = async (registrationId: string, eventId: string) => {
    const { error } = await supabase
      .from('volunteer_registrations')
      .update({ status: 'approved' })
      .eq('id', registrationId);

    if (!error) {
      // Update current_volunteers manually
      const event = events.find(e => e.id === eventId);
      if (event) {
        await supabase
          .from('volunteer_events')
          .update({ current_volunteers: event.current_volunteers + 1 })
          .eq('id', eventId);
      }
      await fetchEvents();
      await fetchRegistrations();
    }
    return { error };
  };

  const rejectRegistration = async (registrationId: string) => {
    const { error } = await supabase
      .from('volunteer_registrations')
      .update({ status: 'rejected' })
      .eq('id', registrationId);

    if (!error) await fetchRegistrations();
    return { error };
  };

  return {
    events,
    registrations,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    approveRegistration,
    rejectRegistration,
    fetchRegistrations,
    refresh: fetchEvents,
  };
};
