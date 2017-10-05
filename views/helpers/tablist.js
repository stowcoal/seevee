module.exports = function(active, tablist) {
  return tablist.fn(this).replace(
    new RegExp(' class=\"nav-link ' + active),
    '$& active'
  );
};
