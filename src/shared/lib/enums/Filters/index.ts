enum Filters {
  typeOperation = "Operation type",
  createdAtDESC = "Date of creation (DESC)",
  createdAtASC = "Date of creation (ASC)",
  byNumberSignaturesDESC = "By number of signatures (DESC)",
  byNumberSignaturesASC = "By number of signatures (ASC)",
}

export const filterOptions = Object.values(Filters);

export default Filters;
