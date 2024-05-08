import createError from 'fastify-error';

const AUTH_FORBIDDEN = 'AUTH_FORBIDDEN';

const AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED';

const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

const BAD_REQUEST = (desc?: string): string => {
  if (!desc) return 'BAD_REQUEST';

  const propperDesc = desc
    .split(' ')
    .map((w) => w.toUpperCase())
    .join('_');

  return `BAD_REQUEST_${propperDesc}`;
};

const ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND';

export const ERR_FARM_CYCLE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle is not found',
  404,
);

export const ERR_FARM_CYCLE_INVALID_START_DATE = createError(
  BAD_REQUEST('ERR_FARM_CYCLE_DOC_IN'),
  'Tanggal DOC-in tidak boleh setelah tanggal hari ini',
  400,
);

export const ERR_FARM_CYCLE_INVALID_TRUCK_TIME = createError(
  BAD_REQUEST('ERR_FARM_CYCLE_DOC_IN_2'),
  'Jam truk berangkat tidak boleh setelah truk tiba',
  400,
);

export const ERR_FARM_CYCLE_REPOPULATE_INVALID_DATE = createError(
  BAD_REQUEST('ERR_FARM_CYCLE_REPOPULATE_INVALID_DATE'),
  'Tanggal Repopulasi tidak boleh sebelum masa siklus atau lebih dari hari ini',
  400,
);

export const ERR_FARM_CYCLE_REPOPULATE_APPROVED_AMOUNT = createError(
  BAD_REQUEST('ERR_FARM_CYCLE_REPOPULATE_APPROVED_AMOUNT'),
  'Jumlah Repopulasi diterima tidak boleh lebih besar dari akumulasi total ayam mati',
  400,
);

export const ERR_REPOPULATION_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Repopulation is not found',
  404,
);

export const ERR_COOP_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Coop is not found', 404);

export const ERR_FARM_CYCLE_TASK_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Task not found',
  404,
);

export const ERR_TARGET_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Target is not found', 404);

export const ERR_VAR_LINKED_DATA_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Variable Linked Data is not found',
  404,
);

export const ERR_TARGET_DAYS_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Target days not found',
  404,
);

export const ERR_TASK_TICKET_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task ticket not found',
  404,
);

export const ERR_TASK_TICKET_DETAIL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task ticket detail not found',
  404,
);

export const ERR_USER_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'User not found', 404);

export const ERR_VARIABLE_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Variable is not found', 404);

export const ERR_FARM_CYCLE_ALERT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert is not found',
  404,
);

export const ERR_FARM_CYCLE_ALERT_INST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert Instruction is not found',
  404,
);

export const ERR_FARM_CYCLE_ALERT_FORM_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert Form is not found',
  404,
);

export const ERR_ALERT_TRIGGERED_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Alert Triggered is not found',
  404,
);

export const ERR_FC_GAMIFICATION_POINT = createError(
  ENTITY_NOT_FOUND,
  'Siklus ini belum bisa gamifikasi',
  404,
);

export const ERR_FC_TASK_GAMIFICATION_POINT = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Task Gamification point is not found',
  404,
);

export const ERR_DATA_VERIFICATION_GAMIFICATION_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Data Verification Gamifiction is not found',
  404,
);

export const ERR_WEIGHING_DATA_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Weighing data is not found',
  404,
);

export const ERR_WEIGHING_DETAIL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Weighing Detail data is not found',
  404,
);

export const ERR_COOP_MEMBER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Coop Member data is not found',
  404,
);

export const ERR_DEVICE_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'device not found', 404);

export const ERR_DEVICE_MULTIPLE_TYPES_OR_NO_TYPE = createError(
  BAD_REQUEST('MULTIPLE_OR_NO_DEVICE_TYPES'),
  'Cannot assign otas on empty or multiple device types',
  400,
);

export const ERR_DEVICE_TYPE_NOT_MATCH = createError(
  BAD_REQUEST('DEVICE_TYPE_NOT_MATCH'),
  'Cannot assign firmware on different device type',
  400,
);

export const ERR_FIRMWARE_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'firmware not found', 404);

export const ERR_NOTIF_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'notification not found', 404);

export const ERR_SELF_REGISTER_USER_EXISTED = (username: string, fullName: string) =>
  createError(
    BAD_REQUEST('SELF_REGISTRATION_1'),
    `Username (${username}) ini telah terdaftar dengan nama ${fullName}. Silahkan tutup pesan ini jika ingin mengganti username atau klik tombol di bawah untuk melakukan penugasan`,
    400,
  )();

export const ERR_SELF_REGISTER_USER_QUOTA = createError(
  BAD_REQUEST('SELF_REGISTRATION_2'),
  'Jumlah akun yang telah didaftarkan sudah melebihi dari 10 akun, untuk bisa menambahkan lagi. Silahkan hubungi Customer Service Pitik melalui tombol dibawah.',
  400,
);

export const ERR_AUTH_FORBIDDEN = createError(AUTH_FORBIDDEN, 'request forbidden', 403);

export const ERR_AUTH_UNAUTHORIZED = createError(AUTH_UNAUTHORIZED, 'request unauthorized', 401);

export const ERR_INTERNAL_SERVER = createError(INTERNAL_SERVER_ERROR, 'internal server error', 500);

export const ERR_BAD_REQUEST = createError(BAD_REQUEST(), 'bad request', 400);

export const ERR_TASK_ALREADY_DONE = createError(BAD_REQUEST(), 'Tugas sudah dikerjakan', 400);

export const ERR_ALERT_ALREADY_DISMISSED = createError(
  BAD_REQUEST(),
  'Peringatan sudah ditutup',
  400,
);

export const ERR_EMAIL_EXIST = createError(
  BAD_REQUEST('USER_REGISTER_1'),
  'Email sudah terdaftar',
  400,
);

export const ERR_PHONE_NUMBER_EXIST = createError(
  BAD_REQUEST('USER_REGISTER_2'),
  'Nomor telepon sudah terdaftar',
  400,
);

export const ERR_WA_NUMBER_EXIST = createError(
  BAD_REQUEST('USER_REGISTER_3'),
  'Nomor whatsapp sudah terdaftar',
  400,
);

export const ERR_USER_CODE_EXIST = createError(
  BAD_REQUEST('USER_REGISTER_4'),
  'Kode pengguna sudah terdaftar',
  400,
);

export const ERR_USER_OWNER_IN_USE = createError(
  BAD_REQUEST('USER_REGISTER_5'),
  'User owner is in use.',
  400,
);

export const ERR_USER_HAS_REGISTERED = createError(
  BAD_REQUEST('USER_REGISTER_6'),
  'User sudah mendaftar, mohon tunggu proses approval',
  400,
);

export const ERR_USER_REGISTRATION_RECORD_NOT_FOUND = createError(
  BAD_REQUEST('USER_REGISTER_7'),
  'Data pendaftaran user tidak di temukan',
  400,
);

export const ERR_USER_TYPE_NOT_EXIST = createError(
  BAD_REQUEST('GET_USERS_1'),
  'User type tidak ditemukan.',
  400,
);

export const ERR_RESET_PASSWORD_NOT_MATCH = createError(
  BAD_REQUEST('ERROR_RESET_PASSWORD_NOT_MATCH'),
  'Password baru tidak sama dengan confirm password',
  400,
);

export const ERR_RESET_INVALID_OLD_PASSWORD = createError(
  BAD_REQUEST('ERR_RESET_INVALID_OLD_PASSWORD'),
  'Password lama anda salah',
  400,
);

export const ERR_FARM_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Farm is not found', 404);

export const ERR_FARM_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_FARM_1'),
  'Farm code is already exist',
  400,
);

export const ERR_CHICK_TYPE_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Chick type not found', 404);

export const ERR_CHICK_TYPE_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_CHICK_TYPE_1'),
  'Chick type code is already exist',
  400,
);

export const ERR_CHICK_TYPE_IN_USE = createError(
  BAD_REQUEST('UPDATE_CHICK_TYPE_2'),
  'Chick type is in use.',
  400,
);

export const ERR_COOP_TYPE_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Coop type is not found', 404);

export const ERR_COOP_TYPE_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_COOP_TYPE_1'),
  'Coop type code is already exist',
  400,
);

export const ERR_COOP_TYPE_IN_USE = createError(
  BAD_REQUEST('UPDATE_COOP_TYPE_2'),
  'Coop type is in use.',
  400,
);

export const ERR_COOP_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_COOP_1'),
  'Coop code is already exist',
  400,
);

export const ERR_CHICK_IN_REQ_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Chick-in-request is not found',
  404,
);

export const ERR_CHICK_IN_REQ_ALREADY_EXISTS = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_1'),
  'Permintaan DOC-in sudah dibuat untuk kandang ini',
  400,
);

export const ERR_CHICK_IN_REQ_INVALID_DATE = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_2'),
  'Tanggal pengajuan DOC-in harus lebih dari tanggal hari ini',
  400,
);

export const ERR_CHICK_IN_REQ_WIHTOUT_DOC = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_3'),
  'Data permintaan DOC-in ini tidak lengkap',
  400,
);

export const ERR_CHICK_IN_REQ_WIHTOUT_PR = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_3'),
  'Data permintaan DOC-in tidak bisa diubah karena kesalahan server',
  500,
);

export const ERR_CHICK_IN_REQ_ALREADY_APPROVED = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_4'),
  'Permintaan DOC-in ini telah disetujui',
  400,
);

export const ERR_CHICK_IN_REQ_ALREADY_CONFIRMED = createError(
  BAD_REQUEST('CONFIM_CHICK_IN_REQ_1'),
  'DOC-in telah dikonfirmasi sebelumnya',
  400,
);

export const ERR_CHICK_IN_REQ_BLOCKED_BY_PR_OVK = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_5'),
  'Mohon setujui permintaan OVK terlebih dahulu',
  400,
);

export const ERR_CHICK_IN_REQ_OVK_REQUIRED = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_6'),
  'Anda belum membuat permintaan OVK sebelumnya, harap isi OVK di permintaan DOC-in ini',
  400,
);

export const ERR_CHICK_IN_REQ_INVALID_RECEIVED_DOC = createError(
  BAD_REQUEST('CONFIM_CHICK_IN_REQ_2'),
  'Jumlah DOC Diterima tidak bisa kurang dari 1000',
  400,
);

export const ERR_METHOD_NOT_IMPLEMENTED = createError(
  INTERNAL_SERVER_ERROR,
  'Method is not implemented yet',
  500,
);

export const ERR_PO_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Purchase order is not found', 404);

export const ERR_PURCHASE_REQUEST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Purchase request is not found',
  404,
);

export const ERR_PURCHASE_REQUEST_MALFORMED = createError(
  INTERNAL_SERVER_ERROR,
  'Purchase request malformed',
  500,
);

export const ERR_PURCHASE_REQUEST_ALREADY_APPROVED = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_1'),
  'Purchase request telah disetujui sebelumnya',
  400,
);

export const ERR_PURCHASE_REQUEST_ALREADY_REJECTED = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_2'),
  'Purchase request telah ditolak sebelumnya',
  400,
);

export const ERR_PURCHASE_REQUEST_INVALID_DATE = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_4'),
  'Tanggal permintaan harus lebih dari tanggal hari ini',
  400,
);

export const ERR_PURCHASE_REQUEST_OVK_INVALID_DATE = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_3'),
  'Tanggal pengajuan OVK harus lebih dari tanggal hari ini',
  400,
);

export const ERR_PURCHASE_REQUEST_ALREADY_CANCELED = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_5'),
  'Purchase request telah dibatalkan sebelumnya',
  400,
);

export const ERR_PURCHASE_REQUEST_OVK_CIR_EXIST = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_6'),
  'Pengajuan OVK tidak dapat dilakukan pada kandang yang sudah aktif',
  400,
);

export const ERR_GOODS_RECEIPT_INVALID_DATE = createError(
  BAD_REQUEST('ERR_GOODS_RECEIPT_1'),
  'Tanggal penerimaan tidak boleh sebelum tanggal pengajuan pengiriman atau setelah tanggal hari ini',
  400,
);

export const ERR_GOODS_RECEIPT_INVALID_QUANTITY = createError(
  BAD_REQUEST('ERR_GOODS_RECEIPT_1'),
  'Jumlah yang diterima tidak bisa lebih dari yang dikirim',
  400,
);

export const ERR_GOODS_RECEIPT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Goods receipt is not found',
  404,
);

export const ERR_COOP_IMAGE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'coop image is not found',
  404,
);

export const ERR_TASK_PRESET_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_TASK_PRESET_1'),
  'Task preset code is already exist',
  400,
);

export const ERR_TASK_PRESET_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task preset is not found',
  404,
);

export const ERR_ALERT_PRESET_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_ALERT_PRESET_1'),
  'Alert preset code is already exist',
  400,
);

export const ERR_ALERT_PRESET_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Alert preset is not found',
  404,
);

export const ERR_TARGET_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_TARGET_1'),
  'Target code is already exist',
  400,
);

export const ERR_TASK_LIBRARY_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task Library is not found',
  404,
);

export const ERR_TASK_LIBRARY_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_TASK_LIBRARY_1'),
  'Task library code is already exist',
  400,
);
export const ERR_DAILY_MONITORING_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Daily monitoring data is not found',
  404,
);

export const ERR_TRANSFER_REQUEST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Transfer request is not found',
  404,
);

export const ERR_TRANSFER_REQUEST_PHOTO_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Transfer request photo is not found',
  404,
);

export const ERR_TRANSFER_REQUEST_MALFORMED = createError(
  INTERNAL_SERVER_ERROR,
  'Transfer request malformed',
  500,
);

export const ERR_TRANSFER_REQUEST_INVALID_DATE = createError(
  BAD_REQUEST('TRANSFER_REQUEST_1'),
  'Tanggal pengajuan transfer pakan harus lebih dari tanggal hari ini',
  400,
);

export const ERR_TRANSFER_REQUEST_INVALID_COOP = createError(
  BAD_REQUEST('TRANSFER_REQUEST_2'),
  'Kandang asal dan kandang tujuan tidak boleh sama!',
  400,
);

export const ERR_TRANSFER_REQUEST_ALREADY_APPROVED = createError(
  BAD_REQUEST('TRANSFER_REQUEST'),
  'Pengajuan transfer pakan sudah di setujui',
  400,
);

export const ERR_VARIABLE_CODE_EXIST = createError(
  BAD_REQUEST('VARIABLE_REGISTER_1'),
  'Kode variabel sudah terdaftar',
  400,
);

export const ERR_VARIABLE_IN_USE = createError(
  BAD_REQUEST('VARIABLE_REGISTER_2'),
  'Variable code is in use.',
  400,
);

export const ERR_PURCHASE_ORDER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Purchase order is not found',
  404,
);

export const ERR_PURCHASE_ORDER_MALFORMED = createError(
  INTERNAL_SERVER_ERROR,
  'Purchase order malformed',
  500,
);

export const ERR_HARVEST_REQUEST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Harvest request is not found',
  404,
);

export const ERR_HARVEST_DEAL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Harvest deal is not found',
  404,
);

export const ERR_HARVEST_REQUEST_ALREADY_APPROVED = createError(
  BAD_REQUEST('ERR_HARVEST_REQUEST_1'),
  'Harvest request telah disetujui sebelumnya',
  400,
);

export const ERR_HARVEST_REQUEST_ALREADY_REJECTED = createError(
  BAD_REQUEST('ERR_HARVEST_REQUEST_2'),
  'Harvest request telah ditolak sebelumnya',
  400,
);

export const ERR_HARVEST_REQUEST_MALFORMED = createError(
  INTERNAL_SERVER_ERROR,
  'Harvest request malformed',
  500,
);

export const ERR_BUILDING_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Building is not found', 404);

export const ERR_ROOM_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Room is not found', 404);

export const ERR_FAN_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_FAN_INSERT'),
  'Something wrong, insert fan is failed',
  400,
);

export const ERR_HEATER_IN_ROOM_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_HEATER_IN_ROOM_INSERT'),
  'Something wrong, insert heater in room is failed',
  400,
);

export const ERR_HARVEST_REALIZATION_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Harvest realization is not found',
  404,
);

export const ERR_ROOM_TYPE_ALREADY_USED = createError(
  BAD_REQUEST('ERR_ROOM_TYPE_ALREADY_USED'),
  'Room-type already used',
  400,
);

export const ERR_MORTALITY_ADJUSTMENT_FAILED_1 = createError(
  BAD_REQUEST('INVALID_ADJUSTMENT_VALUE'),
  'Adjustment value exceeded current population.',
  400,
);

export const ERR_MORTALITY_ADJUSTMENT_FAILED_2 = createError(
  INTERNAL_SERVER_ERROR,
  'Something went wrong during transaction.',
  500,
);

export const ERR_FEED_ADJUSTMENT_FAILED_1 = createError(
  BAD_REQUEST('INVALID_ADJUSTMENT_VALUE'),
  'Adjustment value exceeded current feed stock.',
  400,
);

export const ERR_FEED_ADJUSTMENT_FAILED_2 = createError(
  INTERNAL_SERVER_ERROR,
  'Something went wrong during transaction.',
  500,
);

export const ERR_CLOSE_FARMING_CYCLE_FAILED_1 = createError(
  INTERNAL_SERVER_ERROR,
  'Something went wrong during transaction.',
  500,
);

export const ERR_CLOSE_FARMING_CYCLE_FAILED_2 = createError(
  BAD_REQUEST('CHECK_FEED_LEFTOVER'),
  'Make sure there are no feed leftover.',
  400,
);

export const ERR_HARVEST_REQUEST_QUANTITY = createError(
  BAD_REQUEST('INVALID_HARVEST_REQUEST_QUANTITY'),
  'Permintaan panen tidak boleh melebihi',
  400,
);

export const ERR_HARVEST_DEAL_QUANTITY = createError(
  BAD_REQUEST('INVALID_HARVEST_DEAL_QUANTITY'),
  'Deal panen tidak boleh melebihi',
  400,
);

export const ERR_HARVEST_REALIZATION_QUANTITY = createError(
  BAD_REQUEST('INVALID_HARVEST_REALIZATION_QUANTITY'),
  'Realisasi panen tidak boleh melebihi',
  400,
);

export const ERR_HARVEST_REALIZATION_EXCEED_REQUEST_QUANTITY = createError(
  BAD_REQUEST('INVALID_HARVEST_REALIZATION_EXCEED_REQUEST_QUANTITY'),
  'Realisasi panen melebihi permintaan',
);

export const ERR_HARVEST_REALIZATION_ACCUMULATIVE_QTY_EXCEED = createError(
  BAD_REQUEST('INVALID_HARVEST_REALIZATION_ACCUMULATIVE_QTY_EXCEED'),
  'Total realisasi diajukkan ditambah dengan realisasi sebelumnya telah melebihi permintaan',
);

export const ERR_INITIAL_POPULATION_INVALID = createError(
  BAD_REQUEST('INITIAL_POPULATION_INVALID'),
  'Initial population cannot be less than 1000',
  400,
);

export const ERR_IOT_DEVICE_MAC_EXIST = createError(
  BAD_REQUEST('IOT_DEVICE_MAC_EXIST'),
  'Mac address is already exist',
  400,
);

export const ERR_CONTRACT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Contract data is not found',
  404,
);

export const ERR_CONTRACT_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Contract Type data is not found',
  404,
);

export const ERR_CONTROLLER_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Controller Type data is not found',
  404,
);

export const ERR_CONTRACT_TYPE_IN_BRANCH_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Contract Type in Target Branch not found',
  404,
);

export const ERR_UPSERT_NOT_SPECIFIED = createError(
  INTERNAL_SERVER_ERROR,
  'Cannot upsert without any values specified',
  500,
);

export const ERR_IOT_DEVICE_NOT_FOUND = createError(
  BAD_REQUEST('ERR_IOT_DEVICE_NOT_FOUND'),
  'IoT Device is not found',
  404,
);

export const ERR_IOT_DEVICE_INCOMPLETE_INFRA = createError(
  BAD_REQUEST('IOT_DEVICE_INCOMPLETE_INFRA'),
  'Infrastructure data needs to be completed',
  400,
);

export const ERR_IOT_DEVICE_MULTIPLE_TYPES_OR_NO_TYPE = createError(
  BAD_REQUEST('ERR_IOT_DEVICE_MULTIPLE_TYPES_OR_NO_TYPE'),
  'Cannot assign otas on empty or multiple device types',
  400,
);

export const ERR_IOT_DEVICE_TYPE_NOT_MATCH = createError(
  BAD_REQUEST('ERR_IOT_DEVICE_TYPE_NOT_MATCH'),
  'Cannot assign firmware on different device type',
  400,
);

export const ERR_IOT_SENSOR_CODE_EXIST = createError(
  BAD_REQUEST('IOT_SENSOR_CODE_EXIST'),
  'Sensor code is already exist',
  400,
);

export const ERR_IOT_SENSOR_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_IOT_SENSOR_INSERT_FAILED'),
  "Something's wrong, insert sensor is failed",
  400,
);

export const ERR_IOT_SENSOR_CODE_WRONG_FORMAT = createError(
  BAD_REQUEST('ERR_IOT_SENSOR_CODE_WRONG_FORMAT'),
  'Format sensor code salah',
  400,
);

export const ERR_DOCUMENT_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Document is not found', 404);

export const ERR_IOT_SENSOR_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Sensor is not found', 404);

export const ERR_SMART_CAMERA_COOP_NOT_AVAILABLE = createError(
  ENTITY_NOT_FOUND,
  'Coop not available',
  404,
);

export const ERR_INVALID_NOTIFICATION_PAYLOAD = createError(
  BAD_REQUEST('ERR_INVALID_NOTIFICATION_PAYLOAD'),
  'Invalid notification payload.',
  400,
);

export const ERR_SMART_CAMERA_JOB_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Smart camera job is not found',
  404,
);

export const ERR_IMAGE_REQUEST_QUOTA_EXCEEDED = createError(
  BAD_REQUEST('ERR_IMAGE_REQUEST_QUOTA_EXCEEDED'),
  'anda sudah melebihi batas pengambilan gambar pada jam ini',
  429,
);

export const ERR_CREATE_PRESIGN_URL = createError(
  BAD_REQUEST('ERR_CREATE_PRESIGN_URL'),
  "Something's wrong. Cannot generate presign url.",
  400,
);

export const ERR_CROWD_MANUAL_CHECKING_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Ai crowd manual checking is not found',
  404,
);

export const ERR_IOT_DEVICE_TRACKER_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_IOT_DEVICE_TRACKER_INSERT_FAILED'),
  "Something's wrong, insert device tracker is failed",
  400,
);

export const ERR_HARVEST_REALIZATION_IS_NOT_EDITABLE = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_IS_NOT_EDITABLE'),
  'This realization is not editable',
  400,
);

export const ERR_HARVEST_REALIZATION_DO_EXIST = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_DO_EXIST'),
  'DO number already exist',
  400,
);

export const ERR_HARVEST_REALIZATION_WEIGHING_EXIST = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_WEIGHING_EXIST'),
  'Weighing number already exist',
  400,
);

export const ERR_HARVEST_REALIZATION_INVALID_STATUS = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_INVALID_STATUS'),
  'Please use delete realization API',
  400,
);

export const ERR_HARVEST_REALIZATION_CHICKIN_STOCK_NOT_FOUND = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_CHICKIN_STOCK_NOT_FOUND'),
  'Latest chicken stock is not found. Please input farming cycle daily performance',
  400,
);

export const ERR_HARVEST_REALIZATION_CHICKIN_STOCK_EXCEEDED = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_CHICKIN_STOCK_EXCEEDED'),
  'Cannot create realization.',
  400,
);

export const ERR_INVALID_IP = createError(
  BAD_REQUEST('ERR_ERR_INVALID_IP'),
  'This ip address is invalid',
  400,
);
