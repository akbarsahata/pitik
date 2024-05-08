CREATE SEQUENCE sales.sales_purchase_order_invoice_id START 1 OWNED BY sales.sales_purchase_order_invoice.id;

CREATE OR REPLACE FUNCTION generate_sales_purchase_order_invoice_id()
RETURNS TEXT
AS $$
DECLARE
    next_val INTEGER;
    date_str TEXT;
BEGIN
    SELECT nextval('sales.sales_purchase_order_invoice_id'::regclass) INTO next_val;
    date_str := to_char(CURRENT_DATE AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYMMDD');
    RETURN date_str || '-' || next_val::TEXT;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('0 17 * * *', $$
   BEGIN
      ALTER SEQUENCE sales.sales_purchase_order_invoice_id RESTART WITH 1;
   END;
$$);

