exports.dashboard = (req, res) => {
  console.log("dashboard", req.user);
  res.render("dashboard", {
    user: req.user,
  });
};

exports.home = (req, res) => {
  res.render("index");
};
