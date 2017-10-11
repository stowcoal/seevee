module.exports = function(active, tablist) {
  console.log(tablist);
  return tablist.fn(this).replace(
    new RegExp(' class=\"nav-link ' + active),
    '$& active'
  );
};
