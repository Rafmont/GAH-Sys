const tokenReducer = (state = "", action) => {
  switch (action.type) {
    case "SETTOKEN":
      return (state = action.payload);
    default:
      return state;
  }
};

export default tokenReducer;
