'ues strict';

module.exports = {
  write: true,
  prefix: '^',
  devprefix: '^',
  exclude: [
    'test/fixtures',
  ],
  dep: [
    'long',
  ],
  devdep: [
    'autod',
    'egg-bin',
    'egg-ci',
    'eslint',
    'eslint-config-egg',
    'contributors',
  ],
  keep: [],
  semver: [],
};
