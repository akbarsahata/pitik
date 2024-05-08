ALTER TABLE sales.sales_customer ADD COLUMN ref_branch_id VARCHAR(36) REFERENCES cms.branch(id);
ALTER TABLE sales.vendor ADD COLUMN ref_branch_id VARCHAR(36) REFERENCES cms.branch(id);

--- Migrations script
UPDATE sales.sales_customer 
SET ref_branch_id = (
    SELECT bc.ref_branch_id
    FROM cms.branch_city bc
    WHERE bc.ref_city_id = sales.sales_customer.ref_city_id
);

UPDATE sales.vendor 
SET ref_branch_id = (
    SELECT bc.ref_branch_id
    FROM cms.branch_city bc
    WHERE bc.ref_city_id = sales.vendor.ref_city_id
);
