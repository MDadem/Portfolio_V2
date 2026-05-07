import { UAParser } from 'ua-parser-js';

export function parseUserAgent(uaString) {
  if (!uaString) {
    return { browser: 'Unknown', browserVersion: '', os: 'Unknown', deviceType: 'unknown' };
  }

  const parser = new UAParser(uaString);
  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  let deviceType = 'desktop';
  if (device.type === 'mobile') deviceType = 'mobile';
  else if (device.type === 'tablet') deviceType = 'tablet';

  return {
    browser: browser.name || 'Unknown',
    browserVersion: browser.version || '',
    os: os.name ? `${os.name} ${os.version || ''}`.trim() : 'Unknown',
    deviceType,
  };
}
