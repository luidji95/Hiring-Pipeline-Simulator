import { Link } from "react-router-dom";
import { Button } from "../../../../ui-components";
import "../WorkspaceHeader/workspaceHeader.css";

type Props = {
  name: string;
  isDemo?: boolean;
  onAddCandidate: () => void;
  onClearPipeline: () => void;
};

export const WorkspaceHeader = ({
  name,
  isDemo,
  onAddCandidate,
  onClearPipeline,
}: Props) => {
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
        <Button
          type="button"
          className="workspaceHeader__addBtn"
          onClick={onAddCandidate}
        >
          + Add Candidate
        </Button>

        <Button
          type="button"
          className="workspaceHeader__clearBtn"
          onClick={onClearPipeline}
        >
          Clear Pipeline
        </Button>
      </div>
    </div>
  );
};