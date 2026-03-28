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
} from "../../../../schemas/candidate.validation";
import { Button, Input } from "../../../../ui-components";
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

    const manualForm = useForm<CandidateManualEntryFormData>({
      resolver: zodResolver(CandidateManualEntrySchema),
      mode: "onBlur",
      defaultValues: {
        firstName: "",
        lastName: "",
        title: "",
        email: "",
        linkedinUrl: "",
        githubUrl: "",
        location: "",
      },
    });

    const autoFillForm = useForm<CandidateAutoFillFormData>({
      resolver: zodResolver(CandidateAutoFillSchema),
      mode: "onBlur",
      defaultValues: {
        profileUrl: "",
      },
    });

    const handleTabChange = (tab: TabType) => {
      setActiveTab(tab);
      manualForm.clearErrors();
      autoFillForm.clearErrors();
    };

    const handleCancel = () => {
      manualForm.reset();
      autoFillForm.reset();
      onCancel();
    };

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

        manualForm.reset();
        autoFillForm.reset();
        onSuccess();
      } catch (error) {
        console.error("Failed to add candidate:", error);
      }
    };

    const onAutoFillSubmit = (data: CandidateAutoFillFormData) => {
      console.log("Auto-fill URL:", data.profileUrl);

      // TODO:
      // Ovde kasnije ide AI parsing flow:
      // 1. pošaljem URL na backend / edge function
      // 2. backend vrati strukturisane podatke
      // 3. manualForm.reset(...) popuni polja
      // 4. prebacim korisnika na manual tab da potvrdi podatke

      autoFillForm.reset({
        profileUrl: data.profileUrl,
      });
    };

    return (
      <dialog ref={ref} className="candidate-add-modal">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Candidate</h2>

              <Button
                type="button"
                className="modal-close-btn"
                onClick={handleCancel}
                aria-label="Close modal"
              >
                ✕
              </Button>
            </div>

            <div className="modal-tabs">
              <Button
                type="button"
                className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
                onClick={() => handleTabChange("manual")}
              >
                Manual Entry
              </Button>

              <Button
                type="button"
                className={`tab-button ${activeTab === "autofill" ? "active" : ""}`}
                onClick={() => handleTabChange("autofill")}
              >
                Auto-fill from Profile URL
              </Button>
            </div>

            <div className="modal-body">
              {activeTab === "manual" && (
                <form
                  onSubmit={manualForm.handleSubmit(onManualSubmit)}
                  className="form-group"
                >
                  <div className="form-row">
                    <Input
                      label="First Name *"
                      type="text"
                      placeholder="John"
                      registration={manualForm.register("firstName")}
                      error={manualForm.formState.errors.firstName?.message}
                      wrapperClassName="form-field"
                      inputClassName="form-input"
                    />

                    <Input
                      label="Last Name *"
                      type="text"
                      placeholder="Doe"
                      registration={manualForm.register("lastName")}
                      error={manualForm.formState.errors.lastName?.message}
                      wrapperClassName="form-field"
                      inputClassName="form-input"
                    />
                  </div>

                  <Input
                    label="Position/Title *"
                    type="text"
                    placeholder="e.g., Frontend Developer"
                    registration={manualForm.register("title")}
                    error={manualForm.formState.errors.title?.message}
                    wrapperClassName="form-field"
                    inputClassName="form-input"
                  />

                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    registration={manualForm.register("email")}
                    error={manualForm.formState.errors.email?.message}
                    wrapperClassName="form-field"
                    inputClassName="form-input"
                  />

                  <div className="form-row">
                    <Input
                      label="LinkedIn Profile"
                      type="url"
                      placeholder="https://linkedin.com/in/johndoe"
                      registration={manualForm.register("linkedinUrl")}
                      error={manualForm.formState.errors.linkedinUrl?.message}
                      wrapperClassName="form-field"
                      inputClassName="form-input"
                    />

                    <Input
                      label="GitHub Profile"
                      type="url"
                      placeholder="https://github.com/johndoe"
                      registration={manualForm.register("githubUrl")}
                      error={manualForm.formState.errors.githubUrl?.message}
                      wrapperClassName="form-field"
                      inputClassName="form-input"
                    />
                  </div>

                  <Input
                    label="Location"
                    type="text"
                    placeholder="e.g., Belgrade, Serbia"
                    registration={manualForm.register("location")}
                    error={manualForm.formState.errors.location?.message}
                    wrapperClassName="form-field"
                    inputClassName="form-input"
                  />

                  <div className="modal-actions">
                    <Button
                      type="submit"
                      className="btn-submit"
                      isLoading={manualForm.formState.isSubmitting}
                    >
                      Add Candidate
                    </Button>

                    <Button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === "autofill" && (
                <form
                  onSubmit={autoFillForm.handleSubmit(onAutoFillSubmit)}
                  className="form-group"
                >
                  <Input
                    label="Profile URL *"
                    type="url"
                    placeholder="https://linkedin.com/in/johndoe"
                    registration={autoFillForm.register("profileUrl")}
                    error={autoFillForm.formState.errors.profileUrl?.message}
                    helperText="Paste a public profile URL. AI parsing flow can be added later."
                    wrapperClassName="form-field"
                    inputClassName="form-input"
                  />

                  <p className="autofill-info">
                    We’ll try to extract candidate information automatically. If parsing
                    fails, you can always switch to manual entry.
                  </p>

                  <div className="modal-actions">
                    <Button
                      type="submit"
                      className="btn-submit"
                      isLoading={autoFillForm.formState.isSubmitting}
                    >
                      Parse Profile
                    </Button>

                    <Button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
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