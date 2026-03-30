import "../Topbar/topbar.css";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export const Topbar = ({ searchValue, onSearchChange }: Props) => {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="topbar__left">
          <div className="topbar__brand">
            <span className="topbar__brandDot" />
            <span className="topbar__brandText">Hiring Pipeline Simulator</span>
          </div>
        </div>

        <div className="topbar__center">
          <div className="topbar__search">
            <svg
              className="topbar__searchIcon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm8.9 12.5 2.6 2.6-1.4 1.4-2.6-2.6 1.4-1.4Z"
              />
            </svg>

            <input
              className="topbar__searchInput"
              type="text"
              placeholder="Search by name, title, company, location, tags..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="topbar__right">
          <button type="button" className="topbar__action">
            Statistics
          </button>

          <button
            type="button"
            className="topbar__action topbar__action--primary"
          >
            Theme
          </button>
        </div>
      </div>
    </header>
  );
};