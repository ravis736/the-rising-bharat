const setCacheHeaders = (req, res, next) => {
  const oneDay = 60 * 60 * 24;
  const oneYear = 365 * oneDay;

  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', `public, max-age=${oneYear}, immutable`);
  } else if (req.path.match(/^\/api\//)) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else {
    res.setHeader('Cache-Control', `public, max-age=${oneDay}, must-revalidate`);
  }
  next();
};

module.exports = { setCacheHeaders };
