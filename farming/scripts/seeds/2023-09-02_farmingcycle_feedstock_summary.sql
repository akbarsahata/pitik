update farmingcycle_feedstock_summary
set booked_quantity = subquery.quantity
from (
	select distinct t2.product_code, t.farmingcycle_id, sum(t2.quantity) as quantity from transferrequest t
	left join transferrequestproduct t2 on t2.transferrequest_id = t.id
	where t.is_approved is null
	and t2.category_code = 'PAKAN'
	group by t2.product_code, t.farmingcycle_id 
) as subquery
where farmingcycle_feedstock_summary.farmingcycle_id = subquery.farmingcycle_id
and farmingcycle_feedstock_summary.product_code = subquery.product_code