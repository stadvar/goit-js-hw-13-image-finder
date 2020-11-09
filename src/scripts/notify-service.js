const { info, error, defaults } = require('@pnotify/core');
defaults.delay = 2000;

function notice(type, msg) {
  if (type == 'error') {
    return error({
      text: msg,
    });
  }
  if (type == 'info') {
    return info({
      text: msg,
    });
  }
  return;
}
export default notice;
