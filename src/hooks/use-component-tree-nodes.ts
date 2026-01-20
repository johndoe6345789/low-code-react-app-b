import { useState, useEffect } from 'react';

export const useComponentTreeNodes = (initialExpandedIds: Set<string>) => {
  const [expandedIds, setExpandedIds] = useState(initialExpandedIds);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newIds = new Set(prev);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  return { expandedIds, toggleExpand };
};