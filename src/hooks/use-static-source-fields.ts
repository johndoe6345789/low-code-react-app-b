import { useCallback } from 'react';

export const useStaticSourceFields = (onUpdateField) => {
  const handleChange = useCallback((e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      onUpdateField('defaultValue', parsed);
    } catch (err) {
      // Invalid JSON, don't update
    }
  }, [onUpdateField]);

  return { handleChange };
};