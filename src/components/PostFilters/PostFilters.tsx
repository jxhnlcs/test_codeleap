import type { SortOption } from '../../types';
import { Input } from '../Input';
import styles from './PostFilters.module.css';

interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  usernameFilter: string;
  onUsernameFilterChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  totalPosts: number;
}

export function PostFilters({
  searchTerm,
  onSearchChange,
  usernameFilter,
  onUsernameFilterChange,
  sortBy,
  onSortChange,
  totalPosts,
}: PostFiltersProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter & Sort Posts</h3>
        <span className={styles.count}>{totalPosts} post{totalPosts !== 1 ? 's' : ''}</span>
      </div>
      
      <div className={styles.filters}>
        <Input
          id="search"
          label="Search"
          placeholder="Search in title or content..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Input
          id="username-filter"
          label="Filter by username"
          placeholder="e.g., John Lucas"
          value={usernameFilter}
          onChange={(e) => onUsernameFilterChange(e.target.value)}
        />

        <div className={styles.filterGroup}>
          <label htmlFor="sort" className={styles.label}>
            Sort by
          </label>
          <select
            id="sort"
            className={styles.select}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
