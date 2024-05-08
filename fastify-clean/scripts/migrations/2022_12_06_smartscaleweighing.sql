-- UP

ALTER TABLE cms.t_smartscaleweighing ADD current_population int8 NULL;

-- DOWN

ALTER TABLE cms.t_smartscaleweighing DROP COLUMN current_population;