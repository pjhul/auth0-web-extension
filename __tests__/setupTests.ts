// Prevent webextension-polyfill from complaining during unit tests
// @ts-ignore
window.chrome = {
  runtime: {
    id: 'testid',
  },
};
