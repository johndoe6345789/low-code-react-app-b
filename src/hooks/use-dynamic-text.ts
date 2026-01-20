import { useState, useEffect } from 'react';

export const useDynamicText = (value: any, format: string, currency: string, locale: string) => {
  const [formattedValue, setFormattedValue] = useState('');

  useEffect(() => {
    const formatValue = () => {
      if (value === null || value === undefined) return '';
      switch (format) {
        case 'number':
          return typeof value === 'number' ? value.toLocaleString(locale) : value;
        case 'currency':
          return typeof value === 'number' ? new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value) : value;
        case 'date':
          try {
            return new Date(value).toLocaleDateString(locale);
          } catch {
            return value;
          }
        case 'time':
          try {
            return new Date(value).toLocaleTimeString(locale);
          } catch {
            return value;
          }
        case 'datetime':
          try {
            return new Date(value).toLocaleString(locale);
          } catch {
            return value;
          }
        case 'boolean':
          return value ? 'Yes' : 'No';
        default:
          return String(value);
      }
    };
    setFormattedValue(formatValue());
  }, [value, format, currency, locale]);

  return formattedValue;
};