export const ADD_EMPLOYEE_SELECTORS = {
  firstNameInput: { placeholder: "First Name" },
  middleNameInput: { placeholder: "Middle Name" },
  lastNameInput: { placeholder: "Last Name" },
  employeeIdInput: {
    parent: ".oxd-form-row",
    filterText: "Employee Id",
    child: "input",
  },
  saveButton: { role: "button" as const, name: "Save" },
  cancelButton: { role: "button" as const, name: "Cancel" },
  successToast: ".oxd-toast--success",
  errorToast: ".oxd-toast--error",
  validationErrors: ".oxd-input-field-error-message",
  createLoginToggle: ".oxd-switch-input",
};
