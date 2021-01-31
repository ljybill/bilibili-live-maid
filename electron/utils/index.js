function unix2normal(timestamp) {
  return Number(timestamp + '000');
}

module.exports = {
  unix2normal,
};
