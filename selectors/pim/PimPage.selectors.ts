export const PIM_SELECTORS = {
  pimLink: { role: "link" as const, name: "PIM" },
  addButton: { role: "button" as const, name: "Add" },
  employeeTableRows: ".oxd-table-body .oxd-table-row",
  searchInputEmployeeName: {
    parent: ".oxd-form-row",
    filterText: "Employee Name",
    child: "input",
  },
  searchButton: { role: "button" as const, name: "Search" },
  resetButton: { role: "button" as const, name: "Reset" },
  recordsFoundText: ".orangehrm-horizontal-padding span",
  noRecordsMessage: {
    locator: ".orangehrm-horizontal-padding span",
    hasText: "No Records Found",
  },
  successToast: ".oxd-toast--success",
  deleteConfirmButton: { role: "button" as const, name: "Yes, Delete" },
  tableHeaders: ".oxd-table-header .oxd-table-row .oxd-table-cell",
  editIcon: "i.bi-pencil-fill",
  deleteIcon: "i.bi-trash",
  autocompleteOption: ".oxd-autocomplete-dropdown .oxd-autocomplete-option",
};
