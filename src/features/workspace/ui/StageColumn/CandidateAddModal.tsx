import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { StageId } from "../../workspace.types";
import { addCandidate } from "../../../storage/hpsStorage";
import {
  CandidateManualEntrySchema,
  CandidateAutoFillSchema,
  type CandidateManualEntryFormData,
  type CandidateAutoFillFormData,
}  from "../../../../schemas/candidate.validation";
// import "./candidate-add-modal.css";

type Props = {
  workspaceId: string;
  stageId: StageId;
  onSuccess: () => void;
  onCancel: () => void;
};

type TabType = "manual" | "autofill";

export const CandidateAddModal = React.forwardRef<HTMLDialogElement, Props>(
  ({ workspaceId, stageId, onSuccess, onCancel }, ref) => {
    const [activeTab, setActiveTab] = React.useState<TabType>("manual");

    // Manual Entry Form
    const manualForm = useForm<CandidateManualEntryFormData>({
      resolver: zodResolver(CandidateManualEntrySchema),
      mode: "onBlur",
    });

    // Auto-fill Form
    const autoFillForm = useForm<CandidateAutoFillFormData>({
      resolver: zodResolver(CandidateAutoFillSchema),
      mode: "onBlur",
    });

    const onManualSubmit = (data: CandidateManualEntryFormData) => {
      try {
        addCandidate(workspaceId, {
          firstName: data.firstName,
          lastName: data.lastName,
          title: data.title,
          email: data.email || undefined,
          linkedinUrl: data.linkedinUrl || undefined,
          githubUrl: data.githubUrl || undefined,
          location: data.location || undefined,
          stageId,
        });
        onSuccess();
        if (ref && "current" in ref) {
          ref.current?.close();
        }
      } catch (e) {
        console.error("Failed to add candidate:", e);
      }
    };

    const onAutoFillSubmit = (data: CandidateAutoFillFormData) => {
      // Placeholder - implementacija će doći kasnije
      console.log("Auto-fill URL:", data.profileUrl);
      alert("Auto-fill feature coming soon! URL: " + data.profileUrl);
    };

    const handleCancel = () => {
      onCancel();
      if (ref && "current" in ref) {
        ref.current?.close();
      }
    };

    return (
      <dialog ref={ref} className="candidate-add-modal">
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h2>Add New Candidate</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCancel}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="modal-tabs">
              <button
                type="button"
                className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
                onClick={() => setActiveTab("manual")}
              >
                Manual Entry
              </button>
              <button
                type="button"
                className={`tab-button ${activeTab === "autofill" ? "active" : ""}`}
                onClick={() => setActiveTab("autofill")}
              >
                Auto-fill from Profile URL
              </button>
            </div>

            {/* Tab Content */}
            <div className="modal-body">
              {/* Manual Entry Tab */}
              {activeTab === "manual" && (
                <form
                  onSubmit={manualForm.handleSubmit(onManualSubmit)}
                  className="form-group"
                >
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...manualForm.register("firstName")}
                        className="form-input"
                      />
                      {manualForm.formState.errors.firstName && (
                        <span className="form-error">
                          {manualForm.formState.errors.firstName.message}
                        </span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...manualForm.register("lastName")}
                        className="form-input"
                      />
                      {manualForm.formState.errors.lastName && (
                        <span className="form-error">
                          {manualForm.formState.errors.lastName.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="title">Position/Title *</label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g., Frontend Developer"
                      {...manualForm.register("title")}
                      className="form-input"
                    />
                    {manualForm.formState.errors.title && (
                      <span className="form-error">
                        {manualForm.formState.errors.title.message}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...manualForm.register("email")}
                      className="form-input"
                    />
                    {manualForm.formState.errors.email && (
                      <span className="form-error">
                        {manualForm.formState.errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="linkedinUrl">LinkedIn Profile</label>
                      <input
                        id="linkedinUrl"
                        type="url"
                        placeholder="https://linkedin.com/in/johndoe"
                        {...manualForm.register("linkedinUrl")}
                        className="form-input"
                      />
                      {manualForm.formState.errors.linkedinUrl && (
                        <span className="form-error">
                          {manualForm.formState.errors.linkedinUrl.message}
                        </span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="githubUrl">GitHub Profile</label>
                      <input
                        id="githubUrl"
                        type="url"
                        placeholder="https://github.com/johndoe"
                        {...manualForm.register("githubUrl")}
                        className="form-input"
                      />
                      {manualForm.formState.errors.githubUrl && (
                        <span className="form-error">
                          {manualForm.formState.errors.githubUrl.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="location">Location</label>
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g., Belgrade, Serbia"
                      {...manualForm.register("location")}
                      className="form-input"
                    />
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="btn-submit">
                      Add Candidate
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Auto-fill Tab */}
              {activeTab === "autofill" && (
                <form
                  onSubmit={autoFillForm.handleSubmit(onAutoFillSubmit)}
                  className="form-group"
                >
                  <div className="form-field">
                    <label htmlFor="profileUrl">Profile URL *</label>
                    <input
                      id="profileUrl"
                      type="url"
                      placeholder="https://linkedin.com/in/johndoe"
                      {...autoFillForm.register("profileUrl")}
                      className="form-input"
                    />
                    {autoFillForm.formState.errors.profileUrl && (
                      <span className="form-error">
                        {autoFillForm.formState.errors.profileUrl.message}
                      </span>
                    )}
                  </div>

                  <p className="autofill-info">
                    We'll automatically extract candidate information from their profile.
                  </p>

                  <div className="modal-actions">
                    <button type="submit" className="btn-submit">
                      Parse Profile
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </dialog>
    );
  }
);

CandidateAddModal.displayName = "CandidateAddModal";