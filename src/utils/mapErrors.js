const mapErrors = (e) => {
  const output = {};
  e.inner.forEach((field) => {
    const [error] = field.errors;
    output[field.path] = error;
  });
  return output;
};

export default mapErrors;
