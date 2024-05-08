import createError from 'fastify-error';

const AUTH_FORBIDDEN = 'AUTH_FORBIDDEN';

const AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED';

const INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR';

const AUTH_REFRESH_TOKEN_EXPIRED = 'AUTH_REFRESH_TOKEN_EXPIRED';

const TOO_MANY_ATTEMPT = 'TOO_MANY_ATTEMPT';

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
  'Farming Cycle tidak ditemukan',
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
  'Repopulation tidak ditemukan',
  404,
);

export const ERR_COOP_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Coop tidak ditemukan', 404);

export const ERR_FARM_CYCLE_TASK_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Task tidak ditemukan',
  404,
);

export const ERR_TARGET_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Target tidak ditemukan', 404);

export const ERR_VAR_LINKED_DATA_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Variable Linked Data tidak ditemukan',
  404,
);

export const ERR_TARGET_DAYS_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Target days tidak ditemukan',
  404,
);

export const ERR_TASK_TICKET_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task ticket tidak ditemukan',
  404,
);

export const ERR_TASK_TICKET_DETAIL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task ticket detail tidak ditemukan',
  404,
);

export const ERR_USER_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'User tidak ditemukan', 404);

export const ERR_VARIABLE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Variable tidak ditemukan',
  404,
);

export const ERR_FARM_CYCLE_ALERT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert tidak ditemukan',
  404,
);

export const ERR_FARM_CYCLE_ALERT_INST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert Instruction tidak ditemukan',
  404,
);

export const ERR_FARM_CYCLE_ALERT_FORM_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Alert Form tidak ditemukan',
  404,
);

export const ERR_ALERT_TRIGGERED_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Alert Triggered tidak ditemukan',
  404,
);

export const ERR_FC_GAMIFICATION_POINT = createError(
  ENTITY_NOT_FOUND,
  'Siklus ini belum bisa gamifikasi',
  404,
);

export const ERR_FC_TASK_GAMIFICATION_POINT = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Task Gamification point tidak ditemukan',
  404,
);

export const ERR_DATA_VERIFICATION_GAMIFICATION_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Data Verification Gamifiction tidak ditemukan',
  404,
);

export const ERR_WEIGHING_DATA_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Weighing data tidak ditemukan',
  404,
);

export const ERR_WEIGHING_DETAIL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Weighing Detail data tidak ditemukan',
  404,
);

export const ERR_COOP_MEMBER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Coop Member data tidak ditemukan',
  404,
);

export const ERR_DEVICE_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'device tidak ditemukan', 404);

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

export const ERR_FIRMWARE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'firmware tidak ditemukan',
  404,
);

export const ERR_NOTIF_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'notification tidak ditemukan',
  404,
);

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

export const ERR_USER_CODE_UNEDITABLE = createError(
  BAD_REQUEST('USER_UPDATED_1'),
  'Code user tidak dapat di ubah, mohon hubungi admin jika sangat dibutuhkan',
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

export const ERR_FARM_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Farm tidak ditemukan', 404);

export const ERR_FARM_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_FARM_1'),
  'Farm code is already exist',
  400,
);

export const ERR_FARM_DEACTIVATION_FAILED = createError(
  BAD_REQUEST('FARM_DEACTIVATION_FAILED'),
  'Farm still contains active farming cycle in its coop: ',
  400,
);

export const ERR_CHICK_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Chick type tidak ditemukan',
  404,
);

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

export const ERR_COOP_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Coop type tidak ditemukan',
  404,
);

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

export const ERR_COOP_DEACTIVATION_FAILED = createError(
  BAD_REQUEST('COOP_DEACTIVATION_FAILED'),
  'Coop still contains active farming cycle: ',
  400,
);

export const ERR_CHICK_IN_REQ_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Chick-in-request tidak ditemukan',
  404,
);

export const ERR_CHICK_IN_REQ_ALREADY_EXISTS = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_1'),
  'Permintaan DOC-in sudah dibuat untuk kandang ini',
  400,
);

export const ERR_CHICK_IN_REQ_INVALID_DATE = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_2'),
  'Tanggal pengajuan DOC-in minimal 2 hari dari sekarang',
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

export const ERR_CHICK_IN_REQ_SAPRONAK_REQUIRED = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_7'),
  'Anda belum membuat permintaan sapronak sebelumnya, harap order sapronak melalui tombol Order',
  400,
);

export const ERR_CHICK_IN_REQ_ALREADY_CANCELED = createError(
  BAD_REQUEST('CREATE_CHICK_IN_REQ_4'),
  'Permintaan DOC-in ini telah dibatalkan',
  400,
);

export const ERR_CHICK_IN_REQ_INVALID_RECEIVED_DOC = createError(
  BAD_REQUEST('CONFIM_CHICK_IN_REQ_2'),
  'Jumlah DOC Diterima tidak bisa kurang dari 1000',
  400,
);

export const ERR_PULLET_IN_REQ_INVALID_RECEIVED_DOC = createError(
  BAD_REQUEST('CONFIM_PULLET_IN_REQ'),
  'Jumlah Pullet Diterima tidak bisa kurang dari 1',
  400,
);

export const ERR_CHICK_IN_REQ_FC_STILL_OPENED = createError(
  BAD_REQUEST('ERR_CHICK_IN_REQ_FC_STILL_OPENED'),
  'DOC-in tidak bisa dilakukan karena siklus belum ditutup',
  400,
);

export const ERR_CHICK_IN_REQ_UPDATE_DIFF_FC = createError(
  BAD_REQUEST('ERR_CHICK_IN_REQ_UPDATE_DIFF_FC'),
  'Update DOC-in tidak bisa dilakukan karena ID siklus berbeda',
  400,
);

export const ERR_METHOD_NOT_IMPLEMENTED = createError(
  INTERNAL_SERVER_ERROR,
  'Method is not implemented yet',
  500,
);

export const ERR_PO_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Purchase order tidak ditemukan',
  404,
);

export const ERR_PURCHASE_REQUEST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Purchase request tidak ditemukan',
  404,
);

export const ERR_PURCHASE_REQUEST_MALFORMED = createError(
  INTERNAL_SERVER_ERROR,
  'Purchase request data tidak sesuai ekspektasi',
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

export const ERR_PURCHASE_REQUEST_SAPRONAK_INVALID_DATE = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_4'),
  'Tanggal pengajuan sapronak pra-DOC harus lebih dari tanggal hari ini',
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

export const ERR_PURCHASE_REQUEST_SAPRONAK_CIR_EXIST = createError(
  BAD_REQUEST('ERR_PURCHASE_REQUEST_7'),
  'Pengajuan sapronak pra-DOC tidak dapat dilakukan pada kandang yang sudah aktif',
  400,
);

export const ERR_GOODS_RECEIPT_INVALID_DATE = createError(
  BAD_REQUEST('ERR_GOODS_RECEIPT_1'),
  'Tanggal penerimaan tidak boleh sebelum tanggal pengajuan pengiriman atau setelah tanggal hari ini',
  400,
);

export const ERR_GOODS_RECEIPT_INVALID_QUANTITY = createError(
  BAD_REQUEST('ERR_GOODS_RECEIPT_2'),
  'Jumlah yang diterima tidak bisa lebih dari yang dikirim',
  400,
);

export const ERR_GOODS_RECEIPT_INVALID_PRODUCT = createError(
  BAD_REQUEST('ERR_GOODS_RECEIPT_3'),
  'Produk tidak valid untuk dilaporkan pada penerimaan ini',
  400,
);

export const ERR_GOODS_RECEIPT_PO_INVALID_QUANTITY = createError(
  BAD_REQUEST('ERR_GOODS_RECEIPT_4'),
  'Penerimaan tidak bisa lebih dari Pembelian. Mohon lakukan pembelian tambahan jika barang yang diterima lebih.',
  400,
);

export const ERR_GOODS_RECEIPT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Goods receipt tidak ditemukan',
  404,
);

export const ERR_COOP_IMAGE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'coop image tidak ditemukan',
  404,
);

export const ERR_TASK_PRESET_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_TASK_PRESET_1'),
  'Task preset code is already exist',
  400,
);

export const ERR_TASK_PRESET_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task preset tidak ditemukan',
  404,
);

export const ERR_ALERT_PRESET_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_ALERT_PRESET_1'),
  'Alert preset code is already exist',
  400,
);

export const ERR_ALERT_PRESET_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Alert preset tidak ditemukan',
  404,
);

export const ERR_TARGET_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_TARGET_1'),
  'Target code is already exist',
  400,
);

export const ERR_TASK_LIBRARY_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Task Library tidak ditemukan',
  404,
);

export const ERR_TASK_LIBRARY_CODE_EXIST = createError(
  BAD_REQUEST('CREATE_TASK_LIBRARY_1'),
  'Task library code is already exist',
  400,
);
export const ERR_DAILY_MONITORING_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Daily monitoring data tidak ditemukan',
  404,
);

export const ERR_DAILY_REPORT_FEED_CONSUMPTION_EXCEEDED = createError(
  BAD_REQUEST('ERR_DAILY_REPORT_FEED_CONSUMPTION_EXCEEDED'),
  'Konsumsi pakan tidak dapat melebihi',
  400,
);

export const ERR_DAILY_REPORT_OVK_CONSUMPTION_EXCEEDED = createError(
  BAD_REQUEST('ERR_DAILY_REPORT_OVK_CONSUMPTION_EXCEEDED'),
  'Konsumsi OVK tidak dapat melebihi',
  400,
);

export const ERR_DAILY_REPORT_ALREADY_DONE_LATE = createError(
  BAD_REQUEST('ERR_DAILY_REPORT_ALREADY_DONE'),
  'Laporan tidak diterima karena',
  400,
);

export const ERR_DAILY_REPORT_ABW_OUT_OF_RANGE = createError(
  BAD_REQUEST('ERR_DAILY_REPORT_ABW_OUT_OF_RANGE'),
  'Ada kesalahan pengisian data ABW',
  400,
);

export const ERR_TRANSFER_REQUEST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Transfer request tidak ditemukan',
  404,
);

export const ERR_TRANSFER_REQUEST_PHOTO_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Transfer request photo tidak ditemukan',
  404,
);

export const ERR_TRANSFER_REQUEST_MALFORMED = createError(
  INTERNAL_SERVER_ERROR,
  'Transfer request data tidak sesuai ekspektasi',
  500,
);

export const ERR_TRANSFER_REQUEST_INVALID_DATE = createError(
  BAD_REQUEST('TRANSFER_REQUEST_1'),
  'Tanggal pengajuan transfer harus lebih dari atau sama dengan tanggal hari ini',
  400,
);

export const ERR_TRANSFER_REQUEST_ALREADY_APPROVED = createError(
  BAD_REQUEST('TRANSFER_REQUEST_3'),
  'Pengajuan transfer sudah di setujui',
  400,
);

export const ERR_TRANSFER_REQUEST_INVALID_PRODUCT = createError(
  BAD_REQUEST('TRANSFER_REQUEST_4'),
  'Pengajuan transfer tidak dapat dilakukan karena barang yang dipilih tidak tercatat dengan benar',
  400,
);

export const ERR_TRANSFER_REQUEST_QTY_EXCEED_STOCK = createError(
  BAD_REQUEST('TRANSFER_REQUEST_5'),
  'Pengajuan transfer tidak dapat dilakukan karena jumlah melebihi stok yang tersedia',
  400,
);

export const ERR_TRANSFER_REQUEST_INVALID_COOP = createError(
  BAD_REQUEST('TRANSFER_REQUEST_2'),
  'Kandang asal dan kandang tujuan tidak boleh sama!',
);

export const ERR_TRANSFER_REQUEST_FROM_BRANCH_NO_STOCK = createError(
  BAD_REQUEST('TRANSFER_REQUEST_5'),
  'Pengajuan transfer tidak dapat dilakukan karena tidak ada stok untuk barang',
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
  'Purchase order tidak ditemukan',
  404,
);

export const ERR_PURCHASE_ORDER_REVERTED_CAN_NOT_BE_GR = createError(
  BAD_REQUEST('ERR_PURCHASE_ORDER_REVERTED_CAN_NOT_BE_GR'),
  'Purchase order already reverted',
  400,
);

export const ERR_PURCHASE_ORDER_STILL_PROCESSED = createError(
  BAD_REQUEST('ERR_PURCHASE_ORDER_STILL_PROCESSED'),
  'Permintaan Anda masih dalam proses validasi, harap hubungi pihak procurement apabila barang sudah tiba',
  400,
);

export const ERR_PURCHASE_ORDER_MULTITYPE = createError(
  BAD_REQUEST('ERR_PURCHASE_ORDER_MULTITYPE'),
  'Pastikan RFQ yang hanya untuk PAKAN atau OVK saja, tidak bisa keduanya!',
  400,
);

export const ERR_PURCHASE_ORDER_MALFORMED = createError(
  INTERNAL_SERVER_ERROR,
  'Purchase order data tidak sesuai ekspektasi',
  500,
);

export const ERR_HARVEST_REQUEST_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Harvest request tidak ditemukan',
  404,
);

export const ERR_HARVEST_DEAL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Harvest deal tidak ditemukan',
  404,
);

export const ERR_HARVEST_DEAL_UPON_REALIZATION_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Harvest Deal tidak ditemukan / dibatalkan. Silahkan kontak Sales pada wilayah anda untuk pembuatan Harvest Deal untuk Realisasi.',
  404,
);

export const ERR_HARVEST_DEAL_FOR_REALIZATION_NOT_AVAILABLE = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_NOT_AVAILABLE'),
  'Cannot create realization due to the deal already aborted or completed',
  400,
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
  'Harvest request data tidak sesuai ekspektasi',
  500,
);

export const ERR_BUILDING_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Building type tidak ditemukan',
  404,
);

export const ERR_BUILDING_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Building tidak ditemukan',
  404,
);

export const ERR_ROOM_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Room tidak ditemukan', 404);

export const ERR_ROOM_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Room Type tidak ditemukan',
  404,
);

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
  'Harvest realization tidak ditemukan',
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

export const ERR_CLOSE_FC_FAILED_FEED_LEFTOVER = createError(
  BAD_REQUEST('ERR_CLOSE_FC_FAILED_FEED_LEFTOVER'),
  'Pastikan tidak ada pakan yang tersisa.',
  400,
);

export const ERR_CLOSE_FC_FAILED_PO_UNFULFILLED = createError(
  BAD_REQUEST('ERR_CLOSE_FC_FAILED_PO_UNFULFILLED'),
  'Ada penerimaan yang belum lengkap.',
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

export const ERR_HARVEST_DEAL_CANT_BE_CANCELLED = createError(
  BAD_REQUEST('ERR_HARVEST_DEAL_CANT_BE_CANCELLED'),
  'Harvest deal tidak bisa di cancel',
  400,
);

export const ERR_HARVEST_REALIZATION_DEAL_REJECTED = createError(
  BAD_REQUEST('INVALID_HARVEST_REALIZATION_DEAL_REJECTED'),
  'Tidak dapat melakukan realisasi karena deal panen sudah di batalkan',
  400,
);

export const ERR_HARVEST_REALIZATION_QUANTITY = createError(
  BAD_REQUEST('INVALID_HARVEST_REALIZATION_QUANTITY'),
  'Realisasi panen tidak boleh melebihi',
  400,
);

export const ERR_HARVEST_REALIZATION_EXCEED_DEAL_QUANTITY = createError(
  BAD_REQUEST('INVALID_HARVEST_REALIZATION_EXCEED_DEAL_QUANTITY'),
  'Realisasi panen melebihi permintaan',
);

export const ERR_HARVEST_REALIZATION_ACCUMULATIVE_QTY_EXCEED = createError(
  BAD_REQUEST('INVALID_HARVEST_REALIZATION_ACCUMULATIVE_QTY_EXCEED'),
  'Total realisasi diajukkan ditambah dengan realisasi sebelumnya telah melebihi permintaan',
);

export const ERR_INITIAL_POPULATION_INVALID = createError(
  BAD_REQUEST('INITIAL_POPULATION_INVALID'),
  'Initial population cannot be less than 1',
  400,
);

export const ERR_IOT_DEVICE_MAC_EXIST = createError(
  BAD_REQUEST('IOT_DEVICE_MAC_EXIST'),
  'Mac address is already exist',
  400,
);

export const ERR_IOT_DEVICE_SMART_CONTROLLER_NOT_EXISTS = createError(
  ENTITY_NOT_FOUND,
  'IoT Device Tipe Smart Controller tidak terdaftar pada kandang terkait',
  404,
);

export const ERR_CONTRACT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Contract data tidak ditemukan',
  404,
);

export const ERR_CONTRACT_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Contract Type data tidak ditemukan',
  404,
);

export const ERR_CONTROLLER_TYPE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Controller Type data tidak ditemukan',
  404,
);

export const ERR_CONTRACT_TYPE_IN_BRANCH_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Contract Type in Target Branch tidak ditemukan',
  404,
);

export const ERR_UPSERT_NOT_SPECIFIED = createError(
  INTERNAL_SERVER_ERROR,
  'Cannot upsert without any values specified',
  500,
);

export const ERR_IOT_DEVICE_NOT_FOUND = createError(
  BAD_REQUEST('ERR_IOT_DEVICE_NOT_FOUND'),
  'IoT Device tidak ditemukan',
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

export const ERR_DOCUMENT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Document tidak ditemukan',
  404,
);

export const ERR_IOT_SENSOR_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Sensor tidak ditemukan',
  404,
);

export const ERR_SMART_CAMERA_COOP_NOT_AVAILABLE = createError(
  ENTITY_NOT_FOUND,
  'Coop not available',
  404,
);

export const ERR_SMART_RECORDER_COOP_NOT_AVAILABLE = createError(
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
  'Smart camera job tidak ditemukan',
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
  'Ai crowd manual checking tidak ditemukan',
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

export const ERR_INVALID_PHONE_NUMBER_FORMAT = createError(
  BAD_REQUEST('ERR_INVALID_PHONE_NUMBER_FORMAT'),
  'Invalid phone number format',
  400,
);

export const ERR_SALES_CUSTOMER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Customer tidak ditemukan',
  404,
);

export const ERR_HARVEST_REALIZATION_DO_EXIST = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_DO_EXIST'),
  'DO number already exist',
  400,
);

export const ERR_HARVEST_REALIZATION_WEIGHING_REQUIRED = createError(
  BAD_REQUEST('ERR_HARVEST_REALIZATION_WEIGHING_REQUIRED'),
  'Weighing number is required',
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

export const ERR_SALES_VISIT_CHECK_IN = createError(
  BAD_REQUEST('ERR_SALES_VISIT_CHECK_IN'),
  'Jarak terlalu jauh',
  400,
);

export const ERR_SALES_DELIVERY_CHECK_IN = createError(
  BAD_REQUEST('ERR_SALES_DELIVERY_CHECK_IN'),
  'Delivery location is too far',
  400,
);

export const ERR_SALES_VISIT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Visit record tidak ditemukan',
  404,
);

export const ERR_PLUS_CODE_INVALID_REQUEST = createError(
  BAD_REQUEST('ERR_PLUS_CODE_INVALID_REQUEST'),
  'Cannot decode plus code',
);

export const ERR_ASSIGN_PIC = createError(
  BAD_REQUEST('ERR_ASSIGN_PIC'),
  'Tiket dengan status ON_MAINTENANCE, RESOLVED & OTHER tidak dapat di assign ulang.',
  400,
);

export const ERR_IOT_TICKET_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'IoT ticket not found', 404);

export const ERR_PRODUCTS_IN_CUSTOMER_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_PRODUCTS_IN_CUSTOMER_INSERT_FAILED'),
  'Something wrong, insert products in customer is failed',
  400,
);
export const ERR_FEED_STOCK_SUMMARY_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Feed Stock Summary tidak ditemukan',
  404,
);

export const ERR_FEED_STOCK_ADJUSTMENT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle Feed Stock Adjustment tidak ditemukan',
  404,
);

export const ERR_OVK_STOCK_SUMMARY_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle OVK Stock Summary tidak ditemukan',
  404,
);

export const ERR_FEED_STOCK_ADJUSTMENT_CANNOT_BE_DONE = createError(
  BAD_REQUEST('ERR_FEED_STOCK_ADJUSTMENT_CANNOT_BE_DONE'),
  'Penyesuaian pakan tidak dapat dilakukan',
  400,
);

export const ERR_INVALID_IP = createError(
  BAD_REQUEST('ERR_ERR_INVALID_IP'),
  'This ip address is invalid',
  400,
);

export const ERR_LOGISTIC_INFO_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Logistic info tidak ditemukan',
  404,
);

export const ERR_OVK_STOCK_ADJUSTMENT_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Farming Cycle OVK Stock Adjustment tidak ditemukan',
  404,
);

export const ERR_BRANCH_SAPRONAK_STOCK_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Branch Sapronak Stock tidak ditemukan',
  404,
);

export const ERR_OVK_ADJUSTMENT_QUANTITY_MISMATCH = createError(
  BAD_REQUEST('ERR_OVK_ADJUSTMENT_QUANTITY_MISMATCH'),
  'Jumlah penyesuaian OVK tidak sesuai dengan stok yang tersedia',
  400,
);

export const ERR_B2B_COOP_NAME_ALREADY_EXISTS = createError(
  BAD_REQUEST('ERR_B2B_COOP_NAME_ALREADY_EXISTS'),
  'Nama kandang telah digunakan',
  400,
);

export const ERR_B2B_ROOM_NOT_AVAILABLE = createError(
  BAD_REQUEST('ERR_B2B_ROOM_NOT_AVAILABLE'),
  'Maaf! Sudah mencapai batas maksimal 10 lantai',
  400,
);

export const ERR_B2B_FARM_MEMBER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Bukan merupakan anggota dari peternakan terkait',
  404,
);

export const ERR_B2B_ORGANIZATION_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Organisasi tidak terdaftar',
  404,
);

export const ERR_B2B_NOT_AN_ORGANIZATION_MEMBER = createError(
  AUTH_FORBIDDEN,
  'Anda tidak memiliki akses karena user bukan merupakan anggota dari organisasi',
  403,
);

export const ERR_B2B_POULTRY_WORKER_ASSIGNMENT_NEED_VALID_OWNER = createError(
  BAD_REQUEST('ERR_B2B_POULTRY_WORKER_ASSIGNMENT_NEED_VALID_OWNER'),
  'Penugasan anak kandang gagal dilakukan karena tidak menyertai pemilik peternakan',
  400,
);

export const ERR_B2B_IOT_DEVICE_ALREADY_REGISTERED = createError(
  BAD_REQUEST('ERR_B2B_IOT_DEVICE_ALREADY_REGISTERED'),
  'Device telah terdaftar / digunakan di kandang lain',
  400,
);

export const ERR_B2B_IOT_DEVICE_SENSOR_CODE_ALREADY_REGISTERED = createError(
  BAD_REQUEST('ERR_B2B_IOT_DEVICE_SENSOR_CODE_ALREADY_REGISTERED'),
  'Sensor Code telah terdaftar / digunakan untuk device lain',
  400,
);

export const ERR_DEVICE_UNREACHABLE = createError(
  ENTITY_NOT_FOUND,
  'Device is busy, please try again later',
  204,
);

export const ERR_IOT_DEVICE_SETTINGS_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Device settings tidak ditemukan',
  404,
);

export const ERR_PO_PR_FILTER_DATE_INVALID_DATES = createError(
  BAD_REQUEST('ERR_PO_PR_FILTER_DATE_INVALID_DATES'),
  'Tanggal Dari tidak boleh lebih dari Tanggal Sampai',
  400,
);

export const ERR_ORDER_ISSUE_CATEGORY_IN_VISIT_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_ORDER_ISSUE_CATEGORY_IN_VISIT_INSERT_FAILED'),
  'Something wrong, insert order issue category in visit is failed',
  400,
);

export const ERR_SALES_PURCHASE_ORDER_INVOICE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Invoice tidak ditemukan',
  404,
);

export const ERR_SALES_PRODUCTS_IN_PURCHASE_ORDER_INVOICE_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_PRODUCTS_IN_PURCHASE_ORDER_INVOICE_INSERT_FAILED'),
  'Something wrong, insert products in invoice is failed',
  400,
);

export const ERR_SALES_PURCHASE_ORDER_INVOICE_INVALID_PO = createError(
  BAD_REQUEST('ERR_PURCHASE_ORDER_INVOICE_INVALID_PO'),
  'Purchase order is not confirmed',
  400,
);

export const ERR_SALES_PURCHASE_ORDER_INVOICE_ALREADY_EXIST = createError(
  BAD_REQUEST('ERR_PURCHASE_ORDER_INVOICE_ALREADY_EXIST'),
  'Invoice for this purchase order is already exist',
  400,
);

export const ERR_SALES_PURCHASE_ORDER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Purchase order tidak ditemukan',
  404,
);

export const ERR_SALES_VENDOR_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Vendor tidak ditemukan',
  404,
);

export const ERR_PRODUCTS_IN_VENDOR_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_PRODUCTS_IN_VENDOR_INSERT_FAILED'),
  'Something wrong, insert products in vendor is failed',
  400,
);

export const ERR_SALES_PRODUCTS_IN_PURCHASE_ORDER_INSERT_FAILED = createError(
  BAD_REQUEST('ERR_PRODUCTS_IN_PURCHASE_ORDER_INSERT_FAILED'),
  'Something wrong, insert products in purchase order is failed',
  400,
);

export const ERR_INVALID_TYPE_OPERATION_PAYLOAD = createError(
  BAD_REQUEST('ERR_INVALID_TYPE_OPERATION_PAYLOAD'),
  'Invalid notification payload.',
);

export const ERR_SALES_ORDER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Sales order tidak ditemukan',
  404,
);

export const ERR_SALES_ORDER_INCOMPLETE_DELIVERY_TIME_FILTER = createError(
  BAD_REQUEST('ERR_SALES_ORDER_INCOMPLETE_DELIVERYTIME_FILTER'),
  'Both min and max delivery time must be filled',
  400,
);

export const ERR_SALES_PRODUCTS_IN_SALES_ORDER_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_PRODUCTS_IN_SALES_ORDER_UPSERT_FAILED'),
  'Something wrong, insert products in sales order is failed',
  400,
);

export const ERR_SALES_GOODS_RECEIVED_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Sales goods received tidak ditemukan',
  404,
);

export const ERR_SALES_PRODUCTS_IN_GOODS_RECEIVED_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_PRODUCTS_IN_GOODS_RECEIVED_UPSERT_FAILED'),
  'Something wrong, insert products in goods received is failed',
  400,
);

export const ERR_SALES_OPERATION_UNIT_STOCK_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_OPERATION_UNIT_STOCK_UPSERT_FAILED'),
  'Something wrong, insert products in sales order is failed',
  400,
);

export const ERR_SALES_INTERNAL_TRANSFER_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Internal transfer tidak ditemukan',
  404,
);

export const ERR_SALES_MANUFACTURE_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Manufacture tidak ditemukan',
  404,
);

export const ERR_SALES_PRODUCTS_IN_MANUFACTURE_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_PRODUCTS_IN_MANUFACTURE_UPSERT_FAILED'),
  'Something wrong, insert products in manufacture is failed',
  400,
);

export const ERR_SALES_MANUFACTURE_MISSING_PRODUCT_OUTPUT_DATA = createError(
  BAD_REQUEST('ERR_SALES_MANUFACTURE_MISSING_PRODUCT_OUTPUT_DATA'),
  'Something wrong, products outputs of manufacturing are missing',
  400,
);

export const ERR_SALES_MANUFACTURE_INVALID_STATUS = createError(
  BAD_REQUEST('ERR_SALES_MANUFACTURE_INVALID_STATUS'),
  'Something wrong, invalid status',
  400,
);

export const ERR_SALES_USERS_IN_OPERATION_UNIT_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_USERS_IN_OPERATION_UNIT_UPSERT_FAILED'),
  'Something wrong, insert users in jagal/lapak are failed',
  400,
);

export const ERR_SALES_SO_BOOK_STOCK_STATUS = createError(
  BAD_REQUEST('ERR_SALES_SO_BOOK_STOCK_STATUS'),
  'Cannot proceed the book stock. Order status must be: CONFIRMED for INBOUND or ALLOCATED for OUTBOUND.',
  400,
);

export const ERR_SALES_BOOK_STOCK_INSUFFICIENT_STOCK = createError(
  BAD_REQUEST('ERR_SALES_BOOK_STOCK_INSUFFICIENT_STOCK'),
  'Insufficient stock!',
  400,
);

export const ERR_SALES_SO_EDIT_CONFIRMED = createError(
  BAD_REQUEST('ERR_SALES_SO_EDIT_CONFIRMED'),
  'Cannot edit data. Sales order status must be DRAFT.',
  400,
);

export const ERR_SALES_SO_CANCEL_BOOK_STOCK_STATUS = createError(
  BAD_REQUEST('ERR_SALES_SO_CANCEL_BOOK_STOCK_STATUS'),
  'Cannot proceed the cancellation of book stock. Sales order status must be BOOKED.',
  400,
);

export const ERR_SALES_SO_ASSIGN_DRIVER = createError(
  BAD_REQUEST('ERR_SALES_SO_ASSIGN_DRIVER'),
  'Cannot assign driver to this order. Make sure sales order status is BOOKED or ORDERED',
  400,
);

export const ERR_SALES_SO_PICK_UP_ORDER = createError(
  BAD_REQUEST('ERR_SALES_SO_PICK_UP_ORDER'),
  'Cannot pick this order. Sales order is not ready to deliver or current user not assigned as driver.',
  400,
);

export const ERR_SALES_SO_CANCEL_FAILED = createError(
  BAD_REQUEST('ERR_SALES_SO_CANCEL_FAILED'),
  'Cannot cancel this order! Order status should be DRAFT or CONFIRMED.',
  400,
);

export const ERR_SALES_STOCK_DISPOSAL_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Stock disposal tidak ditemukan',
  404,
);

export const ERR_SALES_PRODUCTS_IN_STOCK_DISPOSAL_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_PRODUCTS_IN_STOCK_DISPOSAL_UPSERT_FAILED'),
  'Something wrong, insert products in stock disposal are failed',
  400,
);

export const ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS = createError(
  BAD_REQUEST('ERR_SALES_STOCK_DISPOSAL_INVALID_STATUS'),
  'Something wrong, status for stock disposal is invalid',
  400,
);

export const ERR_SALES_PRODUCTS_IN_INTERNAL_TRANSFER_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_PRODUCTS_IN_INTERNAL_TRANSFER_UPSERT_FAILED'),
  'Something wrong, insert products in internal transfer is failed',
  400,
);

export const ERR_SALES_CREATE_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_CREATE_INTERNAL_TRANSFER_FAILED'),
  'Cannot create transfer.',
  400,
);

export const ERR_SALES_UPDATE_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_UPDATE_INTERNAL_TRANSFER_FAILED'),
  'Cannot update this transfer! Cannot update non-DRAFT data.',
  400,
);

export const ERR_SALES_CANCEL_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_CANCEL_INTERNAL_TRANSFER_FAILED'),
  'Cannot cancel this transfer! Transfer status should be DRAFT or CONFIRMED.',
  400,
);

export const ERR_SALES_BOOK_STOCK_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_BOOK_STOCK_INTERNAL_TRANSFER_FAILED'),
  'Cannot book stock this transfer! Transfer status should be CONFIRMED.',
  400,
);

export const ERR_SALES_CANCEL_BOOK_STOCK_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_BOOK_STOCK_INTERNAL_TRANSFER_FAILED'),
  'Cannot cancel the book stock! Transfer status should be ORDERED.',
  400,
);

export const ERR_SALES_SET_DRIVER_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_BOOK_STOCK_INTERNAL_TRANSFER_FAILED'),
  'Cannot assign driver! Transfer status should be ORDERED or ASSIGNED.',
  400,
);

export const ERR_SALES_CANCEL_READY_TO_DELIVER_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_CANCEL_READY_TO_DELIVER_INTERNAL_TRANSFER_FAILED'),
  'Transfer status should be READY_TO_DELIVER.',
  400,
);

export const ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_1 = createError(
  BAD_REQUEST('ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_1'),
  'Cannot pickup this transfer! Transfer status should be ASSIGNED.',
  400,
);

export const ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_2 = createError(
  BAD_REQUEST('ERR_SALES_PICKUP_INTERNAL_TRANSFER_FAILED_2'),
  'Cannot pickup this transfer! Current user is not assigned to this transfer.',
  400,
);

export const ERR_SALES_ARRIVED_INTERNAL_TRANSFER_FAILED = createError(
  BAD_REQUEST('ERR_SALES_ARRIVED_INTERNAL_TRANSFER_FAILED'),
  'Cannot deliver this transfer! Transfer status is not on delivery.',
  400,
);

export const ERR_SALES_STOCK_OPNAME_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Stock opname tidak ditemukan',
  404,
);

export const ERR_SALES_PRODUCTS_IN_STOCK_OPNAME_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SALES_PRODUCTS_IN_STOCK_OPNANE_UPSERT_FAILED'),
  'Something wrong, insert products in stock opname is failed',
  400,
);

export const ERR_SALES_STOCK_OPNAME_INPUT_ERROR = createError(
  BAD_REQUEST('ERR_SALES_STOCK_OPNAME_INPUT_ERROR'),
  'Invalid input on stock opname!',
  400,
);

export const ERR_SALES_GOODS_RECEIVED_NOT_ALLOWED = createError(
  BAD_REQUEST('ERR_SALES_GOODS_RECEIVED_NOT_ALLOWED'),
  'Tidak bisa melakukan penerimaan',
  400,
);

export const ERR_SALES_REVERSE_STOCK = createError(
  BAD_REQUEST('ERR_SALES_REVERSE_STOCK'),
  'Cannot reverse stock! Stock is used by other transaction',
  400,
);

export const ERR_SALES_PO_CANCEL = createError(
  BAD_REQUEST('ERR_SALES_PO_CANCEL'),
  'Cannot cancel this purchase order.',
);

export const ERR_OVK_STOCK_ADJUSTMENT_CANNOT_BE_DONE = createError(
  ENTITY_NOT_FOUND,
  'Penyesuaian tidak bisa dilakukan',
  400,
);

export const ERR_SALES_PRICE_IN_CITY_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Price data in the city are tidak ditemukan',
  404,
);

export const ERR_SALES_PRICE_IN_CITY_EXIST = createError(
  BAD_REQUEST('ERR_SALES_PRICE_IN_CITY_EXIST'),
  'Price on the City already exist',
  400,
);

export const ERR_OPERAION_UNIT_CHECK_IN = createError(
  BAD_REQUEST('ERR_OPERATION_UNIT_CHECK_IN'),
  'Check-in location is too far',
  400,
);

export const ERR_SALES_PURCHASE_ORDER_SOURCE = createError(
  BAD_REQUEST('ERR_SALES_PURCHASE_ORDER_SOURCE'),
  'Invalid sales purchase order source',
  400,
);

export const ERR_INVALID_SALES_ORDER_STATUS = createError(
  BAD_REQUEST('ERR_INVALID_SALES_ORDER_STATUS'),
  'Invalid sales order status',
  400,
);

export const ERR_SALES_PURCHASE_ORDER_INVOICE_INVALID_BODY = createError(
  BAD_REQUEST('ERR_PURCHASE_ORDER_INVOICE_INVALID_BODY'),
  'Invalid invoice data',
  400,
);

export const ERR_BRANCH_CITY_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_BRANCH_CITY_UPSERT_FAILED'),
  'Something wrong, insert branch city is failed',
  400,
);

export const ERR_SALES_ORDER_WEIGHT = createError(
  BAD_REQUEST('ERR_SALES_ORDER_WEIGHT'),
  "Invalid sales order's weight",
);

export const ERR_SALES_MANUFACTURE_INVALID_INPUT = createError(
  BAD_REQUEST('ERR_SALES_MANUFACTURE_INVALID_INPUT'),
  'Invalid product manufacture input.',
  400,
);

export const ERR_PO_PR_FILTER_DATE_INCOMPLETE_DATES = createError(
  BAD_REQUEST('ERR_PO_PR_FILTER_DATE_INCOMPLETE_DATES'),
  'Tanggal Dari dan Tanggal Sampai harus diisi!',
  400,
);

export const ERR_B2B_SMART_SCALE_WEIGHINGS_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Data timbang tidak ditemukan',
  404,
);

export const ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT = createError(
  BAD_REQUEST('ERR_B2B_SMART_SCALE_WEIGHING_FAILED_TO_UPSERT'),
  'Data timbang gagal diubah',
  400,
);

export const ERR_INVALID_SALES_ORDER_DATA = createError(
  BAD_REQUEST('ERR_INVALID_SALES_ORDER_DATA'),
  'Invalid sales order data',
  400,
);

export const ERR_SMART_AUDIO_COOP_NOT_AVAILABLE = createError(
  ENTITY_NOT_FOUND,
  'Coop not available',
  404,
);

export const ERR_DAILY_MONITORING_MORTALITY_NOT_MATCH = createError(
  BAD_REQUEST('ERR_DAILY_MONITORING_MORTALITY_NOT_MATCH'),
  'Mortality qty is not equal to sum of mortality list.',
  400,
);

export const ERR_DAILY_MONITORING_MORTALITY_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_DAILY_MONITORING_MORTALITY_UPSERT_FAILED'),
  'Something wrong, upsert mortality is failed',
  400,
);

export const ERR_DAILY_MONITORING_REVISION_REQUEST_NOT_ALLOWED = createError(
  BAD_REQUEST('ERR_DAILY_MONITORING_REVISION_REQUEST_NOT_ALLOWED'),
  'Request revisi hanya dapat dilakukan untuk status DONE atau LATE',
  400,
);

export const ERR_DAILY_MONITORING_REVISION_ALREADY_EXISTS = createError(
  BAD_REQUEST('ERR_DAILY_MONITORING_REVISION_ALREADY_EXISTS'),
  'Request revisi hanya dapat dilakukan sekali',
  400,
);

export const ERR_SUBMIT_DAILY_REPORT_NOT_ALLOWED = createError(
  BAD_REQUEST('ERR_SUBMIT_DAILY_REPORT_NOT_ALLOWED'),
  `Submit laporan tidak dapat dilakukan jika pengajuan revisi sudah selesai`,
  400,
);

export const ERR_DAILY_REPORT_REVISION_NOT_FOUND = createError(
  ENTITY_NOT_FOUND,
  'Pengajuan revisi tidak ditemukan',
  404,
);

export const ERR_NOT_IMPLEMENTED = createError(INTERNAL_SERVER_ERROR, 'Not implemented error', 500);

export const ERR_RECORD_NOT_FOUND = createError(ENTITY_NOT_FOUND, 'Record not found', 404);

export const ERR_SELF_SUPERVISOR_EXCEPTION = createError(
  BAD_REQUEST('ERR_SELF_SUPERVISOR_EXCEPTION'),
  'Cannot set same user as supervisor',
  400,
);

export const ERR_SUPERVISOR_UPSERT_FAILED = createError(
  BAD_REQUEST('ERR_SUPERVISOR_UPSERT_FAILED'),
  'Something wrong, upsert supervisor is failed',
  400,
);

export const ERR_AUTH_APP_ACCESS_FORBIDDEN = createError(
  AUTH_FORBIDDEN,
  'User does not have access to the apps',
  403,
);

export const ERR_BAD_REQUEST_WRONG_PASSWORD = createError(
  BAD_REQUEST(),
  'bad request - invalid password',
  400,
);

export const ERR_CONFIRMATION_PASSWORD_NOT_MATCH = createError(
  'CONFIRMATION_PASSWORD_NOT_MATCH',
  'confirmation password is not match',
  400,
);

export const ERR_INVALID_PASSWORD = createError(
  'ERR_INVALID_PASSWORD',
  'invalid password format',
  400,
);

export const ERR_OLD_PASSWORD_NOT_MATCH = createError(
  'OLD_PASSWORD_NOT_MATCH',
  'old password is not match',
  400,
);

export const ERR_REFRESH_TOKEN_EXPIRED = createError(
  AUTH_REFRESH_TOKEN_EXPIRED,
  'refresh token expired',
  422,
);

export const ERR_TOO_MANY_ATTEMPT = createError(
  TOO_MANY_ATTEMPT,
  'Anda telah mencoba masuk lebih dari 5 kali dengan kata sandi yang salah.',
  403,
);
