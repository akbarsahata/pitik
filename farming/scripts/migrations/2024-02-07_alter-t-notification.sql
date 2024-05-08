ALTER TABLE cms.t_notification ADD app_target varchar NULL;

UPDATE cms.t_notification SET app_target = 'ppl' WHERE app_target IS NULL and DATE(created_date) >= '2023-11-30';
