export async function geolocateIP(ip) {
  // Skip geolocation for localhost/private IPs
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      country: 'Local',
      city: 'Local',
      region: '',
      latitude: 0,
      longitude: 0,
    };
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName,lat,lon`);
    const data = await response.json();

    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown',
        region: data.regionName || '',
        latitude: data.lat || 0,
        longitude: data.lon || 0,
      };
    }
  } catch (err) {
    console.error('Geolocation error:', err.message);
  }

  return {
    country: 'Unknown',
    city: 'Unknown',
    region: '',
    latitude: 0,
    longitude: 0,
  };
}

