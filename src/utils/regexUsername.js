const regexUsername = (username) => {
  let e = username;
  e = e.split(' ').join('-');
  e = e.replace(/[^-,'A-Za-z0-9]+/g, '-');
  e = e.toLowerCase();
  return e;
};

export default regexUsername;
