CREATE SEQUENCE sales.stock_disposal_id START 1 OWNED BY sales.sales_stock_disposal.id;

CREATE OR REPLACE FUNCTION generate_stock_disposal_id()
RETURNS TEXT
AS $$
DECLARE
    next_val INTEGER;
    date_str TEXT;
BEGIN
    SELECT nextval('sales.stock_disposal_id'::regclass) INTO next_val;
    date_str := to_char(CURRENT_DATE AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYMMDD');
    RETURN date_str || '-' || next_val::TEXT;
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('0 17 * * *', $$ 
   BEGIN
      ALTER SEQUENCE sales.stock_disposal_id RESTART WITH 1;
   END;
$$);
