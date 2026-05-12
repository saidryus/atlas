import { useState, useEffect } from 'react';

const CEBU_DEFAULT = { lat: 10.3157, lng: 123.8854 };

/**
 * Returns the user's current geolocation, falling back to Cebu City center.
 */
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(CEBU_DEFAULT);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setLocation(CEBU_DEFAULT);
        setLoading(false);
      },
      { timeout: 5000 }
    );
  }, []);

  return { location, loading };
}
