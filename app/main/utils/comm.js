const { DeviceID } = require('../assets/vid_pid_offline.js');

const getPermission = (vid, pid) => {
  return DeviceID.some(item => item.vendorId === vid && item.productId === pid);
};

module.exports = { getPermission };
