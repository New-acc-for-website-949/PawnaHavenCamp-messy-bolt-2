import { supabase } from './supabase';

export const propertyAPI = {
  getPublicList: async () => {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(
            id,
            image_url,
            display_order
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: properties || []
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return {
        success: false,
        data: []
      };
    }
  },
  getPublicBySlug: async (slug: string) => {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(
            id,
            image_url,
            display_order
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return {
        success: true,
        data: property
      };
    } catch (error) {
      console.error('Error fetching property:', error);
      return {
        success: false,
        data: null
      };
    }
  },
};
