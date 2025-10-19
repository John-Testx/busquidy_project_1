import React from 'react';
import SearchPublicationSection from './SearchPublicationSection';
import PublicationList from './PublicationList';
import { usePublicationFilters } from '@/hooks';

function PublicationsContainer({ userType, id_usuario }) {
  const {
    filters,
    showMoreFilters,
    updateFilter,
    clearFilters,
    toggleMoreFilters,
    setFilters
  } = usePublicationFilters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SearchPublicationSection
        filters={filters}
        showMoreFilters={showMoreFilters}
        onFilterChange={setFilters}
        onUpdateFilter={updateFilter}
        onClearFilters={clearFilters}
        onToggleMoreFilters={toggleMoreFilters}
      />
      <PublicationList
        userType={userType}
        id_usuario={id_usuario}
        filters={filters}
      />
    </div>
  );
}

export default PublicationsContainer;