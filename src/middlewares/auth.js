export const adminAuth = (req, res, next) => {
  let token = "xyz";
  const isTokenAuthenticated = token === "xyz";
  if (isTokenAuthenticated) {
    next();
  } else {
    res.status(401).send("Not Authenticated Admin");
  }
};

export const userAuth = (req, res, next) => {
  let token = "abc";
  const isTokenAuthenticated = token === "abc";
  if (isTokenAuthenticated) {
    next();
  } else {
    res.status(401).send("Not Authenticated User");
  }
};
