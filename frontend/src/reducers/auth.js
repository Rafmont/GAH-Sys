const authReducer = (state = false, action) => {
  switch (action.type) {
    case "SETAUTH":
      return (state = true);
    case "REMOVEAUTH":
      return (state = false);
    default:
      return state;
  }
};

export default authReducer;
