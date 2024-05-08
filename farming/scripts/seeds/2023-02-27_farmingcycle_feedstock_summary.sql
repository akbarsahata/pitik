INSERT INTO cms.farmingcycle_feedstock_summary (
id,
farmingcycle_id,
subcategory_code,
subcategory_name,
product_code,
product_name,
remaining_quantity,
created_by,
created_date,
modified_by,
modified_date
)
select
distinct on(po.farmingcycle_id, grp.product_name)
uuid_generate_v4() as id,
po.farmingcycle_id,
grp.subcategory_code,
grp.subcategory_name,
grp.product_code,
grp.product_name,
sum(grp.quantity) as remaining_quantity,
g.created_by,
g.created_date,
g.modified_by,
NOW()
from goodsreceipt g 
left join goodsreceiptproduct grp on g.id = grp.goodsreceipt_id
left join purchaseorder po on g.purchaseorder_id = po.id
where grp.category_name = 'PAKAN'
and po.farmingcycle_id is not null
group by
po.farmingcycle_id,
g.received_date,
grp.subcategory_code,
grp.subcategory_name,
grp.product_code,
grp.product_name,
grp.quantity,
g.created_by,
g.created_date,
g.modified_by,
g.modified_date

INSERT INTO cms.farmingcycle_feedstock_summary (
id,
farmingcycle_id,
subcategory_code,
subcategory_name,
product_code,
product_name,
remaining_quantity,
created_by,
created_date,
modified_by,
modified_date
)
select
distinct on(tr.farmingcycle_target_id, tr.product_name)
uuid_generate_v4() as id,
tr.farmingcycle_target_id as farmingcycle_id ,
tr.subcategory_code ,
tr.subcategory_name,
tr.product_code,
tr.product_name,
sum(tr.quantity) as remaining_quantity ,
tr.created_by,
tr.created_date,
tr.modified_by,
tr.modified_date
from cms.transferrequest tr
where tr.farmingcycle_target_id is not null
group by
tr.farmingcycle_target_id ,
tr.subcategory_code ,
tr.subcategory_name,
tr.product_code,
tr.product_name,
tr.quantity ,
tr.created_by,
tr.created_date,
tr.modified_by,
tr.modified_date
on conflict on constraint farmingcycle_feedstock_summary_un
do update set remaining_quantity = EXCLUDED.remaining_quantity + cms.farmingcycle_feedstock_summary.remaining_quantity, modified_by = NOW();
