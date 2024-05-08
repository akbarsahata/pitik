ALTER TABLE sales.sales_order ALTER COLUMN ref_customer_id DROP NOT NULL;
ALTER TABLE sales.sales_order ADD COLUMN customer_name VARCHAR(256);

-- Note: run in the same execution sequence
CREATE TYPE sales_order_category_enum AS ENUM ('INBOUND', 'OUTBOUND');
ALTER TABLE sales.sales_order ADD COLUMN category sales_order_category_enum NOT NULL DEFAULT 'OUTBOUND';
