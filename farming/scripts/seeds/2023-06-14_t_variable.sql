INSERT INTO cms.t_variable (id, variable_code, variable_name, variable_uom, variable_type, variable_formula, digit_coma, status, remarks, created_by, created_date, modified_by, modified_date) VALUES('9783234f524c7fe8582b60dd6678f999', 'OVK Consumption', 'OVK Consumption', 'buah', 'simple'::cms."t_variable_variable_type", NULL, 0.0, NULL, NULL, 'NlZ1uBJ48GUJF2Qfx3AeR0cxDDbragSI', '2023-02-22 16:06:57.000', 'NlZ1uBJ48GUJF2Qfx3AeR0cxDDbragSI', '2023-02-22 16:06:57.000');

INSERT INTO cms.t_variablelinkeddata (id, data_type, ref_variable_id) VALUES(17, 'ovk_stock_minus', '9783234f524c7fe8582b60dd6678f999');

