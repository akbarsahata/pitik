create table if not exists sales.sales_internal_transfer
(
    id            varchar(36) not null
        primary key,
    created_date  timestamp   not null,
    modified_date timestamp,
    modified_by   varchar(36)
        constraint sales_it_modified_by
            references cms.t_user,
    created_by    varchar(36) not null
        constraint sales_it_created_by
            references cms.t_user
);

create table if not exists sales.sales_manufacturing
(
    id            varchar(36) not null
        primary key,
    created_date  timestamp   not null,
    modified_date timestamp,
    modified_by   varchar(36)
        constraint sales_manufacturing_modified_by
            references cms.t_user,
    created_by    varchar(36) not null
        constraint sales_manufacturing_created_by
            references cms.t_user
);

create table if not exists sales.sales_goods_received
(
    id                             varchar(36) not null
        primary key,
    created_date                   timestamp   not null,
    modified_date                  timestamp,
    modified_by                    varchar(36)
        constraint sales_gr_modified_by
            references cms.t_user,
    created_by                     varchar(36) not null
        constraint sales_gr_created_by
            references cms.t_user,
    ref_sales_purchase_order_id    varchar(36) not null
        constraint sales_gr_ref_sales_purchase_order_id
            references sales.sales_purchase_order,
    ref_sales_internal_transfer_id varchar(36) not null
        constraint sales_gr_ref_sales_internal_transfer_id
            references sales.sales_internal_transfer,
    ref_sales_manufacturing_id     varchar(36) not null
        constraint sales_gr_ref_sales_manufacturing_id
            references sales.sales_manufacturing,
    ref_sales_sales_order_id       varchar(36) not null
        constraint sales_gr_ref_sales_sales_order_id
            references sales.sales_order
);

alter table sales.sales_goods_received
    owner to postgres;

create table if not exists sales.sales_products_in_goods_received
(
    ref_sales_product_item_id   varchar(36) not null
        constraint sales_products_in_purchase_order_ref_sales_product_item_id
            references sales.sales_product_item,
    ref_sales_goods_received_id varchar(36) not null
        constraint sales_products_in_purchase_order_ref_sales_goods_received_id
            references sales.sales_goods_received,
    quantity                    numeric,
    price                       integer     not null,
    created_by                  varchar(36),
    created_date                timestamp,
    modified_by                 varchar(36),
    modified_date               timestamp,
    deleted_date                timestamp,
    weight                      integer     not null,
    primary key (ref_sales_product_item_id, ref_sales_goods_received_id)
);

alter table sales.sales_products_in_goods_received
    owner to postgres;

