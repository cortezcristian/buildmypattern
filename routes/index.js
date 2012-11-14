
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Build My Pattern', user: req.user });
};