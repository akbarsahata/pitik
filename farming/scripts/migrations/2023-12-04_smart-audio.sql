-- -- --
-- Run in single query
CREATE TYPE cms.smart_audio_upload_file_states AS ENUM (
    'COMMAND_RECEIVED_IN_SERVER',
    'COMMAND_RECEIVED_IN_DEVICE',
    'PRESIGN_REQUESTED',
    'UPLOADING_PROCESS_IN_DEVICE',
    'DONE',
    'ERROR_SEND_COMMAND',
    'ERROR_CREATE_PRESIGN_URL',
    'ERROR_RECORD_SOUND',
    'ERROR_UPLOAD_FILE'
);

CREATE TABLE IF NOT EXISTS cms.ai_smart_audio_job (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref_coop_id VARCHAR(36) NOT NULL,
    ref_room_id VARCHAR(36) NOT NULL,
    ref_sensor_id VARCHAR(36) NOT NULL,
    bucket TEXT NOT NULL,
    file_path TEXT NOT NULL,
    upload_state cms.smart_audio_upload_file_states NOT NULL DEFAULT 'COMMAND_RECEIVED_IN_SERVER',smartaud
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_smart_audio_job_coop ON cms.ai_smart_audio_job (ref_coop_id);
CREATE INDEX IF NOT EXISTS idx_ai_smart_audio_job_room ON cms.ai_smart_audio_job (ref_room_id);
CREATE INDEX IF NOT EXISTS idx_ai_smart_audio_job_sensor ON cms.ai_smart_audio_job (ref_sensor_id);

ALTER TABLE cms.ai_smart_audio_job
    ADD CONSTRAINT fk_ai_smart_audio_job_sensor
    FOREIGN KEY (ref_sensor_id)
    REFERENCES cms.iot_sensor (id);

ALTER TABLE cms.ai_smart_audio_job
    ADD CONSTRAINT fk_ai_smart_audio_job_coop
    FOREIGN KEY (ref_coop_id)
    REFERENCES cms.t_coop (id);

ALTER TABLE cms.ai_smart_audio_job
    ADD CONSTRAINT fk_ai_smart_audio_job_room
    FOREIGN KEY (ref_room_id)
    REFERENCES cms.room (id);

-- -- --

CREATE TABLE IF NOT EXISTS cms.ai_smart_audio_result (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ref_job_id UUID NOT NULL,
    probability REAL,
    ground_truth TEXT,
    conclusion VARCHAR(256),
    result_bucket VARCHAR(256) NOT NULL,
    result_audio_path TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_smart_audio_result_job ON cms.ai_smart_audio_result (ref_job_id);

ALTER TABLE cms.ai_smart_audio_result
    ADD CONSTRAINT fk_ai_smart_audio_result_job
    FOREIGN KEY (ref_job_id)
    REFERENCES cms.ai_smart_audio_job (id);

