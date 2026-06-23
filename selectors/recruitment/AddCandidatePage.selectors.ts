export const ADD_CANDIDATE_SELECTORS = {
  firstNameInput: { placeholder: "First Name" },
  middleNameInput: { placeholder: "Middle Name" },
  lastNameInput: { placeholder: "Last Name" },
  emailInput: {
    parent: ".oxd-form-row",
    filterText: "Email",
    child: "input",
  },
  contactNumberInput: {
    parent: ".oxd-form-row",
    filterText: "Contact Number",
    child: "input",
  },
  notesInput: "textarea.oxd-textarea",
  saveButton: { role: "button" as const, name: "Save" },
  cancelButton: { role: "button" as const, name: "Cancel" },
  successToast: ".oxd-toast--success",
  errorToast: ".oxd-toast--error",
  validationErrors: ".oxd-input-field-error-message",
  vacancyDropdown: {
    parent: ".oxd-form-row",
    filterText: "Vacancy",
    child: ".oxd-select-wrapper",
  },
  vacancyOptions: ".oxd-select-dropdown .oxd-select-option",
  emailError: {
    parent: ".oxd-form-row",
    filterText: "Email",
    child: ".oxd-input-field-error-message",
  },
};
