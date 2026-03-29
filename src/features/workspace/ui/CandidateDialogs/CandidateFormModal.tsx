import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { StageId } from "../../workspace.types";
import { addCandidate, updateCandidate } from "../../../storage/hpsStorage";
import {
  CandidateManualEntrySchema,
  CandidateAutoFillSchema,
  type CandidateManualEntryFormData,
  type CandidateAutoFillFormData,
} from "../../../../schemas/candidate.validation";
import { Button, Input } from "../../../../ui-components";

type CandidateFormMode = "create" | "edit";
type TabType = "manual" | "autofill";

type Props = {
  workspaceId: string;
  stageId: StageId;
  mode: CandidateFormMode;
  candidateId?: string;
  initialValues?: Partial<CandidateManualEntryFormData>;
  onSuccess: () => void;
  onCancel: () => void;
};

const emptyManualValues: CandidateManualEntryFormData = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  linkedinUrl: "",
  githubUrl: "",
  location: "",
};

export const CandidateFormModal = React.forwardRef<HTMLDialogElement, Props>(
  (
    {
      workspaceId,
      stageId,
      mode,
      candidateId,
      initialValues,
      onSuccess,
      onCancel,
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = React.useState<TabType>("manual");

    const manualForm = useForm<CandidateManualEntryFormData>({
      resolver: zodResolver(CandidateManualEntrySchema),
      mode: "onBlur",
      defaultValues:
        mode === "edit"
          ? { ...emptyManualValues, ...initialValues }
          : emptyManualValues,
    });

    const autoFillForm = useForm<CandidateAutoFillFormData>({
      resolver: zodResolver(CandidateAutoFillSchema),
      mode: "onBlur",
      defaultValues: {
        profileUrl: "",
      },
    });

    React.useEffect(() => {
      if (mode === "edit") {
        manualForm.reset({
          ...emptyManualValues,
          ...initialValues,
        });
        setActiveTab("manual");
      } else {
        manualForm.reset(emptyManualValues);
        autoFillForm.reset({ profileUrl: "" });
        setActiveTab("manual");
      }
    }, [mode, initialValues, manualForm, autoFillForm]);

    const handleTabChange = (tab: TabType) => {
      setActiveTab(tab);
      manualForm.clearErrors();
      autoFillForm.clearErrors();
    };

    const handleCancel = () => {
      manualForm.reset(
        mode === "edit"
          ? { ...emptyManualValues, ...initialValues }
          : emptyManualValues
      );
      autoFillForm.reset({ profileUrl: "" });
      setActiveTab("manual");
      onCancel();
    };

    const onManualSubmit = (data: CandidateManualEntryFormData) => {
      try {
        if (mode === "create") {
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
        } else {
          if (!candidateId) {
            throw new Error("Candidate ID is required in edit mode.");
          }

          updateCandidate(workspaceId, candidateId, {
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.title,
            email: data.email || undefined,
            linkedinUrl: data.linkedinUrl || undefined,
            githubUrl: data.githubUrl || undefined,
            location: data.location || undefined,
          });
        }

        manualForm.reset(emptyManualValues);
        autoFillForm.reset({ profileUrl: "" });
        setActiveTab("manual");
        onSuccess();
      } catch (error) {
        console.error("Failed to submit candidate form:", error);
      }
    };

    const onAutoFillSubmit = (data: CandidateAutoFillFormData) => {
      console.log("Auto-fill URL:", data.profileUrl);

      // TODO:
      // 1. pošalješ URL na backend / edge function
      // 2. vratiš strukturisane podatke
      // 3. manualForm.reset(...) popuni polja
      // 4. prebaciš korisnika na manual tab

      autoFillForm.reset({
        profileUrl: data.profileUrl,
      });
    };

    const titleText =
      mode === "edit" ? "Edit Candidate" : "Add New Candidate";

    const submitText =
      mode === "edit" ? "Save Changes" : "Add Candidate";

    return (
      <dialog ref={ref} className="candidate-add-modal">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{titleText}</h2>

              <Button
                type="button"
                className="modal-close-btn"
                onClick={handleCancel}
                aria-label="Close modal"
              >
                ✕
              </Button>
            </div>

            {mode === "create" && (
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
            )}

            <div className="modal-body">
              {(activeTab === "manual" || mode === "edit") && (
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
                      {submitText}
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

              {activeTab === "autofill" && mode === "create" && (
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

CandidateFormModal.displayName = "CandidateFormModal";