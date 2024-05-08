## v1.12.5

### Fix

- **user poultry**: disable user code after creation
- **user owner**: disable user code after creation
- **user internal**: disable user code after creation

## v1.12.4 (2023-04-11)

### Fix

- **historical data**: to allow export to excel when no tab is clicked (#350)

## v1.12.3 (2023-04-10)

### Fix

- **harvest**: round the total harvest in kg's value into two decimal places (#349)

## v1.12.2 (2023-03-30)

### Fix

- **contract**: contract adjustment flow (#343)

## v1.12.1 (2023-03-30)

### Fix

- **acl**: for iotoperations so they can access report pages too (#347)

## v1.12.0 (2023-03-30)

### Feat

- **report iot**: create historical data report (#346)

## v1.11.0 (2023-03-28)

### Feat

- **report iot**: create device offline tracker report (#333)

## v1.10.2 (2023-03-27)

### Fix

- **harvest**: disable action, input component and add button back when user open harvest final (#329)

## v1.10.1 (2023-03-21)

### Feat

- **iot**: milestone 4 and 5 (#319)

## v1.10.0 (2023-03-20)

### Feat

- **harvest**: Create report Harvest Farming Cycle (#322)

## v1.9.2 (2023-03-17)

### Fix

- **state**: catch for undefined dropdown values (#325)

## v1.9.1 (2023-03-17)

### Fix

- **daily-performance**: handle `yellowCardImages` and `Nullable` values (#315)

## v1.9.0 (2023-03-17)

### Refactor

- **types**: remove a lot of `any`s (#312)

## v1.8.1 (2023-03-13)

### Fix

- **farming-cycle**: fix validation on close farming cycle (#302)

## v1.8.0 (2023-03-13)

### Refactor

- **states**: refactor state to better use TypeScript's types (#299)

## v1.7.10 (2023-03-10)

### Fix

- **internal**: update internal's supervisor choices (#287)

## v1.7.9 (2023-03-08)

### Fix

- **internal**: fix advance search by user's type (#284)

## v1.7.8 (2023-03-07)

### Fix

- **internal**: use dynamically data from api (#281)

## v1.7.7 (2023-03-03)

### Fix

- **dailyperformance**: fix feed's data rounding (#273)

## v1.7.6 (2023-02-23)

### Fix

- **acl**: adjust acl (#248)

## v1.7.5 (2023-02-09)

### Fix

- **room**: fix room dropdown (#232)

## v1.7.4 (2023-02-08)

### Fix

- **device-management**: Implement device status field (#231)

## v1.7.3 (2023-02-03)

### Fix

- **farmingCycles**: set `farmingStatus` to string (#224)

## v1.7.2 (2023-02-03)

### Fix

- **farming-cycle**: set contract as optional (#220)

## v1.7.1 (2023-02-03)

### Fix

- **dropdown**: fix dropdown on device type (#219)

## v1.7.0 (2023-02-03)

### Feat

- **device**: Implement FWIoT Milestone 3 and 4 (#218)

## v1.6.0 (2023-02-03)

### Feat

- **contract**: Implement contract page (#213)

## v1.5.0 (2023-01-12)

### Feat

- **login**: login with Google SSO (#183)

## v1.4.1 (2022-12-21)

### Fix

- **devices**: include `sensor_id` on edit device request (#161)

## v1.4.0 (2022-12-21)

### Feat

- release `v1.4.0` (#160)

### Fix

- **service**: fix optional `branchId` and `contract`

## v1.3.12 (2022-12-14)

### Fix

- **user**: remove `refOwnerId` payload (#148)

## v1.3.10 (2022-12-08)

### Fix

- **iot device**: take out device id (#136)
- **farming-cycles**: fix close farming cycles (#137)

## v1.3.9 (2022-12-05)

### Fix

- **room**: fix conditions (#132)

## v1.3.8 (2022-12-05)

### Fix

- **room**: fix create and edit room (#130)

## v1.3.7 (2022-11-30)

### Feat

- **farming-cycles**: set min start date to 7 days from today (#122)

## v1.3.6 (2022-11-30)

### Fix

- **iot edit device**: fix null firmware version after edit device (#121)

## v1.3.5 (2022-11-28)

### Fix

- update acl for iot dashboard (#118)

## v1.3.4 (2022-11-28)

### Fix

- **iot upload firmware**: fix filename when createFirmware and send filename when uploadFirmware (#117)

## v1.3.3 (2022-11-28)

### Fix

- **coop**: fix coop's supervisor (#114)

## v1.3.2 (2022-11-28)

## v1.3.1 (2022-11-28)

### Feat

- **daily-performances**: add anchor button variant (#111)

## v1.3.0 (2022-11-28)

## v1.2.3 (2022-11-24)

### Fix

- **daily-performances**: get chick-in date from farmingCycleStartDate (#105)

## v1.2.2 (2022-11-24)

## v1.2.1 (2022-11-16)

## v1.2.0 (2022-11-10)

## v1.1.2 (2022-11-10)

### Fix

- **repopulate**: show error when mortality more than a new repopulate (#64)

## v1.1.1 (2022-11-10)

### Fix

- **farming-cycle**: exclude today from farming cycle (#59)

## v1.1.0 (2022-11-04)

## v1.0.12 (2022-11-03)

### Fix

- **farming cycle**: adjust chick type dropdown to Cobb only (#56)

## v1.0.11 (2022-11-03)

### Fix

- **farming-cycle**: fix can't close farming cycle (#55)
- **logout**: fix logout on firefox and safari (#53)

## v1.0.10 (2022-11-01)

### Fix

- **farming-cycle**: fix date validation (#49)

## v1.0.9 (2022-11-01)

### Fix

- **coops**: increase limit on get available coops (#48)

## v1.0.8 (2022-10-28)

### Fix

- **user**: Improvement List (#47)

## v1.0.7 (2022-10-27)

### Fix

- **task-libraries**: fix variable and feedbrand (#46)

## v1.0.6 (2022-10-26)

### Fix

- **daily performance**: fix invalid date (#43)

## v1.0.5 (2022-10-26)

### Fix

- **daily performance**: fix advance search city and district (#42)

## v1.0.4 (2022-10-26)

### Fix

- **variable**: fix variable type advance search (#40)

## v1.0.3 (2022-10-25)

### Fix

- **poultry**: fix undefined owner (#39)

## v1.0.2 (2022-10-25)

### Fix

- **auth**: adjust `/fms-users/me` response (#37)

## v1.0.1 (2022-10-25)

### Fix

- **auth**: use `/fms-users/me` (#36)

## v1.0.0 (2022-10-25)

### Feat

- **error**: add error page handler (#34)
- **repopulate**: fix connect API
- **repopulate**: implement all field
- **repopulate**: implement modal
- **auth**: get user's data on login (#22)
- **loading**: add loading component and implement in all page (#18)
- **home**: add version number on the homepage
- **master/master-data/coop**: implement role rank approval in coop's edit page
- **master/master-data/coop**: implement role rank approval in coop
- **farming**: implement edit farming cycle page
- **farming**: implement add new farming cycle page
- **master/user/internal**: role rank for approval - create dropdown supervisor for Edit modul
- **master/user/internal**: role rank for approval - Create dropdown supervisor for Create modul
- **daily-performances**: add details section
- **daily-performances**: implement daily performances dashboard
- **task preset**: implement task preset
- **alert preset**: implement alert preset
- **poultry**: implement poultry page
- **coop type**: implement coop type
- **chicken strain**: implement page and advance search
- **task-libraries**: add task-libraries sections
- **variable**: implement variable page edit and add
- **internal**: migrate to react-query
- **target**: Implement target library
- **alert**: implement alert preset
- **preset library/task**: implement preset library/task sections
- **wysiwyg**: implement rich text editor component
- **tabs**: implement custom tabs styling
- **coop**: edit coop images
- **alert**: implement alert page
- **coops**: implement upload images
- **coop**: upload multiple images
- **coop**: implement coop pages
- **404**: implement 404 page
- **farm**: implement edit page
- **farm**: implement create farm page
- **farm**: search farm
- **coop**: create coop input other
- **coops**: add new coops
- **input**: add file and number
- **coop**: coop search
- **chicken strains**: implement chicken strains page
- **farms**: [TEMP] implement farm read table page
- **coop**: implement table only in coop page
- **cooptype**: add edit cooptype page
- **cooptype**: implement create new cooptype
- **cooptype**: add search functionality
- **cooptype**: add list cooptype page, add skeleton edit and create page
- **poultr edit**: implement edit poultr page
- **create/poultr**: add dropdown search for owner
- **dropdown**: add `input` type on dropdown
- **edit**: implement edit owner page
- **poultry**: implement create new poultry
- **owner**: add new owner registration page
- **poultry**: implement poultry read only page
- **api/user**: implement apiTypes parameter
- **api**: add api for status checking
- **internal**: implement edit internal user
- **pagination**: add custom table pagination
- **refresh**: implement refresh token on api req
- **api**: add mask for refresh token
- **internals**: implement per page table (IP-136) and search from beck-end (IP-141)
- **edit-internal**: apply url encoding
- **create**: implement user role
- **create user**: add general error sign
- **create users**: add ui validation
- **users**: integrate with BE
- **development**: merge update from development
- **api**: create api masks for get and create users
- **development**: merge update from development branch
- **dropdown**: add dropdown component
- **home**: change app name
- **internal/create**: add basic internal users registration page
- **internals**: add skeleton for edit existing internal users
- **table**: add basic global search
- **pagination**: add baci customization on table pagination
- **admin/create**: add skeleton page
- **master/user/admin**: add base page
- **button**: add icon only button
- **button**: add icon only button
- **favicon**: add favicon
- **background**: change default background color
- **packages**: upgrade packages
- **login**: login connect to beck-end
- **input**: add error state
- **input**: finishing input components
- **global**: add skeleton page for every pages
- **input**: create global component
- **navbar**: add mobile support
- implement rough navigation bar
- **input**: create global component input
- **commit**: add commit scripts
- configure prettier
- configure nextjs and tailwindcss

### Fix

- **farming-cyles**: hide repopulation temporarily
- **farming-cycle**: fix empty chicktype, supplier, and contract
- **preset**: fix undefined cooptype
- **daily-performance**: fix date format issues
- **daily-performance**: fix accordion sizing
- **daily-performance**: fix date and icons
- **daily-performance**: fix bw day 8th rounding
- **repopulate**: fix title to string
- **farming cycle**: fix key
- **repopulate**: fix modal on save
- **update navbar**: hide unused edit profile and change password page (#31)
- **repopulate**: fix error type
- **daily-performance**: fix typo
- **daily-performance**: migrate from `harvested` to `dailyHarvest`
- **build**: fix build error
- **daily-performance**: add multiple PPL
- **daily-performance**: fix UI (#24)
- **daily-performance**: remove growth columns (#23)
- **fms app**: migrate API from /v1 to /v2 (#20)
- **daily-performance**: fix bw and status
- **daily-performance**: fix `Segera Review` color (#12)
- **daily-performance**: fix mortality status (#11)
- **farming cycle**: adjust requirement KK and AK
- **coop**: fix poultry leaders options are not fetched (#9)
- **master/master-data/coop**: add hint text to encourage user choosing the lowest rank of role
- **coop**: fix required to optional
- **coop**: implement roleId
- **farming cycle**: fix coop field
- **parents**: set limit to 999
- **coop**: fix supervisor not fetched
- **coop**: fix search by owner
- **coop**: use id_cms
- **coop**: remove unecessary comment
- **coop**: addd missing function call
- **dropdown**: remove vertical separator
- **coop type**: change title button
- **farm**: fix reset all district and city
- **farming**: change date on farming start date
- **poultry**: fix advance searh
- **internal**: escape for c level
- **master/master-data/coop**: take out user role on coop's choose supervisor
- **master/master-data/coop**: update dropdown conditional to restrict supervisor option for coop
- **master/user/internal**: hide "admin" option from dropdown while selecting role
- **internal user & coop**: create conditional params to specify return supervisor
- **farming cycle**: test case jenkins
- **parent**: add user role on choose supervisor
- **farming cycle**: test case closed button
- **farming-cycle**: fix checkRequired()
- **farming cycle**: fix closed date
- **farming cycle**: add owner column and fix button closed date
- **daily performance**: details not showing
- **farming cycle**: fix advance search and remove time hour on table list
- **farming cycle**: bug fix owner search
- **internal**: fix initial role rank
- **internal**: fix missing parent on edit
- **user**: fix roleId on user menu
- **task-library**: handle empty dataType
- **task-library**: fix no variable escape
- **daily-performance**: fix IP-516
- **user**: fix raw phone
- **internal**: fix unable to create/edit ppl
- **daily-performance**: fix IP-489 and IP-466
- **master/user/internal**: hide supervisor when userType is VP and C Level
- **daily-performance**: fix table sizing
- **daily-performance**: set timeout on bulk edit
- **daily-performance**: set accordion open to false
- **coop**: remove min date and add date check function
- **coop**: add coop code
- **user/internal/edit**: set initial data for roleId, parentId and roleRank
- **global**: prevent refetch on window focus
- **coop**: fix IP-453, IP-474
- IP-456, IP-461, IP-454, IP-438, IP-436
- **task-library**: fix bugs on IP-446
- **farm**: check address length
- **global**: add escape for error and findIndex
- **user**: set parentId and roleId as optional
- **phone**: use getRawPhone()
- **password**: change min length to 5
- **daily-performance**: fix owner advance search
- **readme**: test jenkins
- **readme**: test jenkins pt.2
- **readme**: test jenkins
- **build**: fix failed build
- **coop**: implement coop sections
- **alert**: fix wording
- **task-libraries**: fix edit bugs
- **task lib**: fix regex validate time
- **internal**: set initial tablePage to 1
- **uuid**: migrate from uuid to randomHexString()
- **login**: change `email` to `username`
- **internal**: change old search value on cancel
- **global**: add page extension
- **remarks**: remove required remarks
- **build**: add missing keys
- **preset lib**: fix scroll on modal
- **coop**: change date
- **task preset**: add status
- **coop**: add status
- **farm**: add status
- **poultry**: add status
- **build**: fix useEffect dependencies issue
- **date and remarks**: delete required remarks and change date
- **coop**: fix edit coop merge nightmare
- **tsconfig**: fix alias
- **effect**: disable lint for exhaustive deps
- **coop**: add key in list
- **farm**: fix update farm payload
- **create-user**: fix create user input
- **chicken-strain**: fix dropdown title on search
- **edit api**: set ownerId param as optional
- **createUser**: add ownerId on poultry only
- **poultry**: add new dropdown search part 1
- **poultry**: add owner in table
- **create internal**: change title internal
- **api**: add ownerID opt on payload
- **api**: add condition for ownerId and refOwnerId
- **user**: user API
- **deployment**: fix swc issue on nextjs deployment
- **icon**: replace icon folder name
- **build**: fix build issue on edit page
- **comment**: remove unecessary comment
- **pagination**: overwrite ant style on pagination
- **search**: handle on key delete
- **favicon**: fix favicon not displayed on nested routes
- **title**: rename titles
- **packages**: reconfigure package dependencies again
- **cookies**: fix cookies vulnerabilities
- **login**: fix style on login page
- **input**: fix merge conflict
- **component**: fix component input
- **navbar options**: auto close subitem on other sub item opening
- **try icon in input**: try icon in input
- **navbar**: fix navbar subitem spacing
- **app logo**: fix app logo sizing
- **icons**: fix icon not showing bugs
- **logo**: fix forwardRef issue

### Refactor

- **user/owner's create page**: add advance search field and implement redux state management
- **farm**: refactor and bugfix farm sections
- **target-libraries**: refactor and add advance search on target libraries
- **internal**: refactor user/internal
- **target-libraries**: refactor wording
- **alias**: add import aliases
- **global**: refactor index on each page
- **coops**: change naming
- **chicken strain**: refactor naming
- **log**: remove unecessary console log
- **errorMessage**: convert `errorText` to `errorMessage`
- **icon**: rename icons folder
- **types**: move types to separate `*.type.tsx` file
- **Button**: refactor button component
- **navbar**: refactor all navbar
