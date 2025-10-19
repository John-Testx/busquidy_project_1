import { useState, useCallback } from 'react';

const DEFAULT_FILTERS = {
  searchText: '',
  projectSize: 'todos',
  sortBy: 'relevancia',
  date: 'todos',
  modality: 'todos',
  disability: 'todos',
  experience: 'todos',
  career: 'todos',
  region: 'todos',
  commune: 'todos',
  workday: 'todos',
  workArea: 'todos'
};

const usePublicationFilters = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Update filter value
  const updateFilter = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  // Update multiple filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Toggle more filters visibility
  const toggleMoreFilters = useCallback(() => {
    setShowMoreFilters(prev => !prev);
  }, []);

  return {
    filters,
    showMoreFilters,
    updateFilter,
    updateFilters,
    clearFilters,
    toggleMoreFilters,
    setFilters
  };
};

export default usePublicationFilters;