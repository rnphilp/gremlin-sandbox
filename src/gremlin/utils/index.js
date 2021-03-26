export const mapToJson = (map) => {
  const properties = {};
  map.forEach((item, key) => {
    if (typeof key === 'object') {
      if (item instanceof Map) {
        properties[key.elementName] = mapToJson(item);
      } else {
        properties[key.elementName] = item;
      }
    } else {
      const value =
        typeof item === 'string' || typeof item === 'number' ? item : item;
      properties[key] = value;
    }
  });
  return properties;
};
