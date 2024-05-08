-- Note: run in the same execution sequence
CREATE TYPE product_notes_in_sales_order_cut_type_enum AS ENUM ('BEKAKAK', 'REGULAR');
ALTER TABLE sales.product_notes_in_sales_order ADD COLUMN cut_type product_notes_in_sales_order_cut_type_enum NOT NULL DEFAULT 'REGULAR';

-- Note: run in the same execution sequence
CREATE TYPE products_in_sales_order_cut_type_enum AS ENUM ('BEKAKAK', 'REGULAR');
ALTER TABLE sales.products_in_sales_order ADD COLUMN cut_type products_in_sales_order_cut_type_enum NOT NULL DEFAULT 'REGULAR';
