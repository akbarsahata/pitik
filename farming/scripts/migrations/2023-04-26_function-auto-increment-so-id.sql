-- Auto increment sales_order.id with format YYMMDD-XXXX...
-- Reset date and sequence every midnight in Asia/Jakarta timezone
-- Need to enable pg_cron extension

-- create sequence
CREATE SEQUENCE sales.sales_order_id START 1 OWNED BY sales.sales_order.id;

-- create function
CREATE OR REPLACE FUNCTION generate_sales_order_id()
RETURNS TEXT
AS $$
DECLARE
    next_val INTEGER;
    date_str TEXT;
BEGIN
    SELECT nextval('sales.sales_order_id'::regclass) INTO next_val;
    date_str := to_char(CURRENT_DATE AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta', 'YYMMDD');
    RETURN date_str || '-' || next_val::TEXT;
END;
$$ LANGUAGE plpgsql;

-- enable pg_cron
CREATE EXTENSION pg_cron;

-- set cron job to reset sequence every 17:00 UTC or 00:00 Asia/Jakarta
SELECT cron.schedule('0 17 * * *', $$ 
   BEGIN
      ALTER SEQUENCE sales.sales_order_id RESTART WITH 1;
   END;
$$);
