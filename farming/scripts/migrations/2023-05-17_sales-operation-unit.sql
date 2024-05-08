create table if not exists sales.sales_operation_unit
(
    id                   varchar(36) default uuid_generate_v4() not null
        primary key,
    operation_unit_name  VARCHAR(256)                           NOT NULL,
    ref_province_id      integer                                not null
        constraint sales_operation_unit_ref_province_id
            references cms.t_province,
    ref_city_id          integer                                not null
        constraint sales_operation_unit_ref_city_id
            references cms.t_city,
    ref_district_id      integer                                not null
        constraint sales_operation_unit_ref_district_id
            references cms.t_district,
    ref_province_id      integer                                not null
        constraint sales_operation_unit_ref_province_id
            references cms.t_province,
    ref_city_id          integer                                not null
        constraint sales_operation_unit_ref_city_id
            references cms.t_city,
    ref_branch_id        varchar(36)                            not null
        constraint sales_operation_unit_ref_branch_id
            references cms.branch,
    plus_code            VARCHAR(120)                           NOT NULL,
    latitude             FLOAT                                  NOT NULL,
    longitude            FLOAT                                  NOT NULL,
    status               BOOLEAN                                NOT NULL,
    type                 VARCHAR(36)                            NOT NULL,
    category             VARCHAR(36)                            NOT NULL,
    price_basis          VARCHAR(36),
    lb_quantity          INT,
    lb_weight            FLOAT,
    lb_price             DOUBLE PRECISION,
    lb_loss              FLOAT,
    innards_price        DOUBLE PRECISION,
    head_price           DOUBLE PRECISION,
    feet_price           DOUBLE PRECISION,
    operational_days     INT,
    operational_expenses DOUBLE PRECISION,
    created_by           varchar(36)
        constraint sales_operation_unit_created_by
            references cms.t_user,
    created_date         timestamp,
    modified_by          varchar(36)
        constraint sales_operation_unit_modified_by
            references cms.t_user,
    modified_date        timestamp
);

alter table sales.sales_operation_unit
    owner to postgres;

