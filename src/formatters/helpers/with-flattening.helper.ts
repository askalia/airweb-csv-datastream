export function withFlattening(data) {
  const isTrueObject = (value) =>
    value && value.constructor.name !== 'Date' && typeof value === 'object';

  const isObject = (value) => isTrueObject(value) && !Array.isArray(value);

  const isArray = (value) => isTrueObject(value) && Array.isArray(value);

  data.forEach((record) => {
    for (const [prop, value] of Object.entries(record) as any) {
      if (isObject(value)) {
        record[prop] = Object.values(record[prop]).join(' ');
      } else if (isArray(value)) {
        record[prop] = value.join(',');
      }
    }
  });
  return data;
}
