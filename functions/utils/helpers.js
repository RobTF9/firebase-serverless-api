// helpers
const createSlug = (title, username) => {
  return (
    title
      .replace(/[^a-z0-9_]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() +
    "-" +
    username
  );
};

const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmptyArray = array => {
  if (array.length === 0) return true;
  else return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email.match(regEx)) return true;
  else return false;
};

const reduceUserDetails = data => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

  if (!isEmpty(data.website.trim())) {
    data.website.trim().substring(0, 4) !== "http"
      ? (userDetails.website = `http://${data.website.trim()}`)
      : (userDetails.website = data.website);
  }

  if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  return userDetails;
};

module.exports = {
  createSlug,
  isEmail,
  isEmpty,
  isEmptyArray,
  reduceUserDetails
};
