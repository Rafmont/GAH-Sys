const idReducer = (state = "", action) => {
  switch (action.type) {
    case "SETID":
      return (state = action.payload);
    default:
      return state;
  }
};

export default idReducer;
