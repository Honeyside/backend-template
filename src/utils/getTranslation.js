const getTranslation = ({ dictionary, language, code }) => {
  if (!dictionary) {
    return '[dictionary error]';
  }

  if (!dictionary[code]) {
    return `[${code}]`;
  }

  if (dictionary[code][language]) {
    return dictionary[code][language];
  }

  if (dictionary[code].en) {
    return dictionary[code].en;
  }

  return `[${code}]`;
};

export default getTranslation;
