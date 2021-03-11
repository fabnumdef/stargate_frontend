const findValidationDate = (units) => {
    let validationDate = new Date(units[0].steps[0].state.date);

    units.forEach((u) => {
        u.steps.forEach((s) => {
            if (new Date(s.state.date) > validationDate) {
                validationDate = new Date(s.state.date);
            }
        });
    });

    return validationDate;
};

export default findValidationDate;
