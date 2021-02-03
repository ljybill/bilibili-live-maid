export function unix2normal(timestamp: number): number {
  return Number(
    timestamp
      .toString()
      .concat('000'),
  );
}

export default {
  unix2normal,
};
