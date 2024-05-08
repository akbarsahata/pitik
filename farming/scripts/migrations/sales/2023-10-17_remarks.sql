ALTER TABLE sales.purchase_order ADD COLUMN remarks TEXT;
ALTER TABLE sales.goods_received ADD COLUMN remarks TEXT;
ALTER TABLE sales.sales_order ADD COLUMN remarks TEXT;
ALTER TABLE sales.sales_order ADD COLUMN driver_remarks TEXT;
ALTER TABLE sales.internal_transfer ADD COLUMN driver_remarks TEXT;
ALTER TABLE sales.internal_transfer ADD COLUMN remarks TEXT;

