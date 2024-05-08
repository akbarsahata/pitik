export const MQTT_GLOBAL_TOPIC = 'pitik/farm/#';
export const DEVICE_STATUS_TOPIC = 'pitik/device/setid/';
export const ASSIGN_OTA_TOPIC = 'pitik/device/update/';
export const DEVICE_CMD_TLV_TOPIC = 'pitik/device/command/';

// upload mean the direction is from device to server
// $share: enable feature shared subscription. read: http://www.steves-internet-guide.com/mqttv5-shared-subscriptions/
export const UPLOAD_GLOBAL_TOPIC = '$share/farming//u/+';
export const UPLOAD_CONVENTRON_TOPIC = '$share/farming/pitik/farm/+/+/sndp';

// download mean the direction is from server to device
export const DOWNLOAD_GLOBAL_TOPIC = '/d/+';
