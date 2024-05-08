CREATE SEQUENCE sales.purchase_order_id START 1 OWNED BY sales.sales_purchase_order.id;

CREATE OR REPLACE FUNCTION generate_purchase_order_id()
RETURNS TEXT
AS $$
DECLARE
    next_val INTEGER;
    date_str TEXT;
BEGIN
    SELECT nextval('sales.purchase_order_id'::regclass) INTO next_val;
    date_str := to_char(CURRENT_DATE AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYMMDD');
    RETURN date_str || '-' || next_val::TEXT;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('0 17 * * *', $$ 
   BEGIN
      ALTER SEQUENCE sales.purchase_order_id RESTART WITH 1;
   END;
$$);
