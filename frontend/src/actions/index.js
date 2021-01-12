export const increment = (number) => {
  return {
    type: "INCREMENT",
    payload: number,
  };
};

export const decrement = () => {
  return {
    type: "DECREMENT",
  };
};

export const setToken = (token) => {
  return {
    type: "SETTOKEN",
    payload: token,
  };
};

export const setName = (name) => {
  return {
    type: "SETNAME",
    payload: name,
  };
};

export const setLevel = (level) => {
  return {
    type: "SETLEVEL",
    payload: level,
  };
};

export const setAuth = () => {
  return {
    type: "SETAUTH",
  };
};

export const removeAuth = () => {
  return {
    type: "REMOVEAUTH",
  };
};

export const setID = (id) => {
  return {
    type: "SETID",
    payload: id,
  };
};
