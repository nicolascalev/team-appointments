export const timeZones = Intl.supportedValuesOf('timeZone').map(zone => ({
  value: zone,
  label: zone,
})); 