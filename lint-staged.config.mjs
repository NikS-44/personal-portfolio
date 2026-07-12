import fs from "node:fs";

/** Drop symlink paths — Prettier errors if they're passed explicitly. */
function withoutSymlinks(files) {
  return files.filter((file) => {
    try {
      return !fs.lstatSync(file).isSymbolicLink();
    } catch {
      return false;
    }
  });
}

export default {
  "*": (files) => {
    const targets = withoutSymlinks(files);
    return targets.length === 0 ? [] : [`prettier --write --ignore-unknown ${targets.map(quote).join(" ")}`];
  },
  "*.{js,jsx,ts,tsx}": (files) => {
    const targets = withoutSymlinks(files);
    return targets.length === 0 ? [] : [`eslint --fix ${targets.map(quote).join(" ")}`];
  },
};

function quote(file) {
  return `"${file.replaceAll('"', '\\"')}"`;
}
