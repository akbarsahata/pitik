insert into cms.transferrequestproduct (
id,
transferrequest_id,
category_code ,
category_name ,
subcategory_code ,
subcategory_name ,
product_code ,
product_name ,
quantity ,
uom 
)
select
uuid_generate_v4() as id,
tr.id as transferrequest_id ,
'PAKAN' as category_code ,
'PAKAN' as category_name ,
coalesce (tr.subcategory_code, '') as subcategory_code ,
coalesce (tr.subcategory_name,  '') as subcategory_name ,
case
	when tr.product_code is null then tr.subcategory_code 
	when tr.product_code = '' then tr.subcategory_code 
	else tr.product_code 
end as product_code ,
case
	when tr.product_name is null then tr.subcategory_code 
	when tr.product_name = '' then tr.subcategory_code 
	else tr.product_name 
end as product_name  ,
tr.quantity as quantity ,
'karung' as uom 
from cms.transferrequest tr
where tr.is_approved = true