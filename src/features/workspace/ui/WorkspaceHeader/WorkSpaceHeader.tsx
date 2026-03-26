import { Link } from "react-router-dom";
import "../WorkspaceHeader/workspaceHeader.css";

type Props = {
  name: string;
  isDemo?: boolean;
};

export const WorkspaceHeader = ({ name, isDemo }: Props) => {
  return (
    <div className="workspaceHeader">
      <div className="workspaceHeader__left">
        <Link to="/" className="workspaceHeader__back">
          ← Back to landing page
        </Link>

        <div className="workspaceHeader__titleWrap">
          <h1 className="workspaceHeader__title">{name}</h1>

          <span
            className={`workspaceHeader__badge ${
              isDemo ? "workspaceHeader__badge--demo" : ""
            }`}
          >
            {isDemo ? "Demo" : "Custom"}
          </span>
        </div>
      </div>

      <div className="workspaceHeader__right">
        <button className="workspaceHeader__addBtn">
          + Add Candidate
        </button>
      </div>
    </div>
  );
};