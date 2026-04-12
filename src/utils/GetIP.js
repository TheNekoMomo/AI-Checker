const os = require('os');

async function getPublicIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Could not fetch public IP:', error.message);
    return 'Unable to determine';
  }
}

module.exports = getPublicIP;