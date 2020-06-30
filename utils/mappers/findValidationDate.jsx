const findValidationDate = (state) => {
  let validationDate = new Date(state.records[0].date);

  state.records.forEach((step) => {
    if (new Date(step.date) > validationDate) {
      validationDate = new Date(step.date);
    }
  });

  return validationDate;
};

export default findValidationDate;
