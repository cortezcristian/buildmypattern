
/*
 * GET home page.
 */

exports.edit = function(req, res){
  res.render('diagram', { title: 'Build My Pattern: Diagram Edition', user: req.user });
};