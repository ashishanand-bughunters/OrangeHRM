export const EMPLOYEE_DETAIL_SELECTORS = {
  firstNameInput: { placeholder: "First Name" },
  middleNameInput: { placeholder: "Middle Name" },
  lastNameInput: { placeholder: "Last Name" },
  employeeIdInput: {
    parent: ".oxd-form-row",
    filterText: "Employee Id",
    child: "input",
  },
  saveButtons: { role: "button" as const, name: "Save" },
  successToast: ".oxd-toast--success",
  errorToast: ".oxd-toast--error",
  validationErrors: ".oxd-input-field-error-message",
  personalDetailsHeader: { tag: "h6", hasText: "Personal Details" },
};
