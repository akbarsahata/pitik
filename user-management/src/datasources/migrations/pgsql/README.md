# MIGRATION GUIDANCE

### Database Setup

To setup the database in your local, you can follow:

1. Create Tables by Executing The SQL file in `migrations/tables` directory with these orders:
```
1. role.sql
2. api.sql
3. presetaccess.sql
4. presetaccessd.sql
5. roleacl.sql
6. rolerank.sql
7. user.sql
8. privilege.sql
9. app.sql
```
2. Init Record Metadata by executing sql file in `migrations/seeds/metadata` with these orders:
```
1. roleData.sql
2. roleRankData.sql
3. userAdmin.sql
```

3. [Optional] you can add data sample with executing the sql files in: `migrations/seeds/datatest`