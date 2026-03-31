import "../BoardControls/boardControls.css";

export type BoardSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc";

export type BoardFilters = {
  location: string;
  tag: string;
  starredOnly: boolean;
};

type Props = {
  filters: BoardFilters;
  sortBy: BoardSortOption;
  availableLocations: string[];
  availableTags: string[];
  onFiltersChange: (nextFilters: BoardFilters) => void;
  onSortChange: (value: BoardSortOption) => void;
  onClearAll: () => void;
};

export const BoardControls = ({
  filters,
  sortBy,
  availableLocations,
  availableTags,
  onFiltersChange,
  onSortChange,
  onClearAll,
}: Props) => {
  const handleLocationChange = (value: string) => {
    onFiltersChange({
      ...filters,
      location: value,
    });
  };

  const handleTagChange = (value: string) => {
    onFiltersChange({
      ...filters,
      tag: value,
    });
  };

  const handleStarredChange = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      starredOnly: checked,
    });
  };

  const hasActiveFilters =
    filters.location !== "" ||
    filters.tag !== "" ||
    filters.starredOnly ||
    sortBy !== "newest";

  return (
    <section className="board-controls">
      <div className="board-controls__left">
        <div className="board-controls__group">
          <label className="board-controls__label" htmlFor="sortBy">
            Sort
          </label>
          <select
            id="sortBy"
            className="board-controls__select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as BoardSortOption)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>

        <div className="board-controls__group">
          <label className="board-controls__label" htmlFor="locationFilter">
            Location
          </label>
          <select
            id="locationFilter"
            className="board-controls__select"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
          >
            <option value="">All locations</option>
            {availableLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="board-controls__group">
          <label className="board-controls__label" htmlFor="tagFilter">
            Tag
          </label>
          <select
            id="tagFilter"
            className="board-controls__select"
            value={filters.tag}
            onChange={(e) => handleTagChange(e.target.value)}
          >
            <option value="">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <label className="board-controls__checkbox">
          <input
            type="checkbox"
            checked={filters.starredOnly}
            onChange={(e) => handleStarredChange(e.target.checked)}
          />
          <span>Starred only</span>
        </label>
      </div>

      <div className="board-controls__right">
        <button
          type="button"
          className="board-controls__clearBtn"
          onClick={onClearAll}
          disabled={!hasActiveFilters}
        >
          Clear all
        </button>
      </div>
    </section>
  );
};