exports.ensureBusAuthenticated = (req, res, next) => {
    if (!req.session.authenticatedBus) {
      return res.redirect("/conductor");
    }
    res.locals.authenticatedBus = req.session.authenticatedBus;
    next();
  };
  