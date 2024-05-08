ALTER TABLE cms.goodsreceiptphoto ADD "type" varchar NULL;
COMMENT ON COLUMN cms.goodsreceiptphoto."type" IS 'e.g surat-jalan, doc-in-form';
