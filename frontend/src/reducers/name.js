const nameReducer = (state = "", action) => {
  switch (action.type) {
    case "SETNAME":
      return (state = action.payload);
    default:
      return state;
  }
};

export default nameReducer;
