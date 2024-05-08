ALTER TABLE sales.stock_opname ADD COLUMN ref_reviewer_id VARCHAR(36) REFERENCES cms.t_user(id);
ALTER TABLE sales.stock_opname ADD COLUMN reviewed_date TIMESTAMP;

ALTER TABLE sales.stock_disposal ADD COLUMN ref_reviewer_id VARCHAR(36) REFERENCES cms.t_user(id);
ALTER TABLE sales.stock_disposal ADD COLUMN reviewed_date TIMESTAMP;

