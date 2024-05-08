-- Run in single query sequence
ALTER TABLE sales.product_notes_in_sales_order ADD COLUMN ref_product_category_id VARCHAR(36) REFERENCES sales.sales_product_category(id);

ALTER TABLE sales.product_notes_in_sales_order DROP CONSTRAINT products_in_sales_order_pk_1;
ALTER TABLE sales.product_notes_in_sales_order ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;
ALTER TABLE sales.product_notes_in_sales_order ALTER COLUMN ref_product_item_id DROP NOT NULL;

-- Update the ref_product_category_id in sales.product_notes_in_sales_order
-- based on the corresponding values in sales.sales_product_item
UPDATE
	sales.product_notes_in_sales_order
SET
	ref_product_category_id = spi.ref_category_id
FROM
	sales.sales_product_item spi
WHERE
	sales.product_notes_in_sales_order.ref_product_item_id = spi.id
	AND sales.product_notes_in_sales_order.ref_product_item_id IS NOT NULL;

