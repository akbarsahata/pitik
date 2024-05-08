INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('73db61f1-50f8-45fa-b0c9-e7c77a6fcb7f'::uuid, 'superadmin', 'system', '2022-06-06 15:06:10.467', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('910de463-e8b5-4e4a-8d26-c7472262251a'::uuid, 'developer', 'system', '2022-06-09 11:10:01.762', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('f3f73536-31d3-4c8f-b5eb-21c0e0d98dfe'::uuid, 'technician', 'system', '2022-06-15 10:52:44.071', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('133cdf4c-16cd-4b2f-8ad0-bbcd4ef01bf4'::uuid, 'admin', 'system', '2022-06-30 16:20:41.587', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('df77098d-adea-407c-a9e0-0c966691fc08'::uuid, 'mitra manager', 'system', '2022-07-01 13:26:06.981', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('00232377-9dea-4a5a-8c2b-87e6fc139f60'::uuid, 'business unit', 'system', '2022-07-01 13:26:29.267', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('ac3be6b1-5c4d-4c02-9a05-ecbd785ffa32'::uuid, 'kawan KSO', 'system', '2022-07-01 13:27:47.178', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('4319e131-1c9f-439f-89e0-47755cc1161a'::uuid, 'poultry leader', 'system', '2022-07-01 13:28:30.156', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('eff725b9-a127-4700-a5e6-ee00bdcbe1e7'::uuid, 'poultry worker', 'system', '2022-07-01 13:28:46.999', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('d3aebdff-d0e1-455d-a7ca-82713e6a3a3a'::uuid, 'internal', 'system', '2022-07-01 13:29:01.540', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('194da309-42f8-4048-af90-97e8f42e6df5'::uuid, 'system integrator', 'system', '2022-07-01 13:29:09.267', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('63507ef3-c547-4ddb-96f6-ba127be464bb'::uuid, 'odoo', 'system', '2022-07-01 13:29:15.372', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('0b7ed634-66b3-4072-87a1-2fd8242c47de'::uuid, 'operational', 'system', '2022-07-01 15:52:01.616', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('f09f8915-d071-4e35-b3f1-e957e415a3fb'::uuid, 'pembantu umum', 'system', '2022-08-30 14:16:37.920', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('e45fa358-5bf7-4391-9a14-200cd59f5d92'::uuid, 'area manager', 'system', '2022-08-30 14:19:28.747', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('54449366-c95b-4501-9d08-b90fc83298a2'::uuid, 'general manager', 'system', '2022-08-30 14:19:42.893', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('19cf2b30-3c88-48f8-8fe0-9f8cc3f0e2f5'::uuid, 'vice president', 'system', '2022-08-30 14:20:10.877', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('71aa81d4-1d0c-493c-8c47-babcca093f2b'::uuid, 'c level', 'system', '2022-08-30 14:20:19.497', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('ce71f240-a294-4c60-8111-345e64d7502f'::uuid, 'owner', 'system', '2022-06-06 15:04:43.115', NULL, NULL, NULL);
INSERT INTO usermanagement.role
(id, name, created_by, created_date, modified_by, modified_date, additional)
VALUES('2ffb24ce-03d2-4483-97eb-7938527c88bc'::uuid, 'ppl', 'system', '2022-06-06 15:00:35.357', NULL, NULL, NULL);

INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('dc8812e5-836e-42a6-90a5-7f191f6e413f'::uuid, 0, 'internal', '71aa81d4-1d0c-493c-8c47-babcca093f2b'::uuid, 'system', '2022-08-31 14:52:48.879', NULL, NULL, NULL);
INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('41fd8e38-145c-4977-8a95-dd26a96d7019'::uuid, 1, 'internal', '19cf2b30-3c88-48f8-8fe0-9f8cc3f0e2f5'::uuid, 'system', '2022-08-31 14:53:08.832', NULL, NULL, NULL);
INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('ae71255d-3706-4a89-98c1-86121c327b21'::uuid, 2, 'internal', '54449366-c95b-4501-9d08-b90fc83298a2'::uuid, 'system', '2022-08-31 14:53:42.847', NULL, NULL, NULL);
INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('e7c773e8-5af6-46b4-a26e-1e59ce2fbbea'::uuid, 3, 'internal', 'e45fa358-5bf7-4391-9a14-200cd59f5d92'::uuid, 'system', '2022-08-31 14:54:19.741', NULL, NULL, NULL);
INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('c88f6a61-5624-4474-87b9-c0452bbb1c97'::uuid, 4, 'internal', 'df77098d-adea-407c-a9e0-0c966691fc08'::uuid, 'system', '2022-08-31 14:54:39.934', NULL, NULL, NULL);
INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('7f0b3aaa-f05f-4e3a-80ca-7ababf74eaec'::uuid, 5, 'internal', '2ffb24ce-03d2-4483-97eb-7938527c88bc'::uuid, 'system', '2022-08-31 14:55:01.884', NULL, NULL, NULL);
INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('d780edf4-4bfa-484c-a2e5-110518e58f5d'::uuid, 6, 'internal', 'f09f8915-d071-4e35-b3f1-e957e415a3fb'::uuid, 'system', '2022-08-31 14:55:18.156', NULL, NULL, NULL);
INSERT INTO usermanagement.rolerank
(id, "rank", context, ref_role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('837bb5f9-897d-4918-aa3e-d6f0a415b91d'::uuid, 7, 'internal', '133cdf4c-16cd-4b2f-8ad0-bbcd4ef01bf4'::uuid, 'system', '2022-09-30 16:12:52.224', NULL, NULL, NULL);

INSERT INTO usermanagement."user"
(id, full_name, email, phone, "password", status, lang, accept_tnc, parent_id, role_id, created_by, created_date, modified_by, modified_date, additional)
VALUES('a6e03784-522b-4bc9-b9e4-1e5961d3da6f'::uuid, 'Pitik Developer', 'developer@pitik.id', '081234567894', '$2a$10$jAPlKHCDKY0ZqzXlwZwRr.0O9acQzUQswsUVGSkKP9xhTMKIsffJq', true, 'in', 1, NULL, '73db61f1-50f8-45fa-b0c9-e7c77a6fcb7f', 'system', '2022-04-22 02:16:29.189', NULL, NULL, '{"id_cms":"33ffe34db2385a1b4b827b9919c98e5f"}'::json);

