Routes map [[updated on 1 FEb 2023]]-->

/customers
./register
    ~ req.body -> name, email, password, phone
./getcustomer
    ~ req.body -> phone
./login
    ~ req.body -> email, password
./getcustomerid
    ~ req.body -> uuid

/companies
./register
    ~ req.body -> name, username, password, number of store, target_customers, company_type, found_date, size
./getCompany
    ~ req.body -> username
./login
    ~ req.body -> username, password
./update
    ~ req.body -> number_of_store, target_customer, size

/stores
./register
    ~ req.body -> name, username, password, location, size, company_id
./getStore
    ~ req.body -> username
./login
    ~ req.body -> username, password

/admins
./getAdmin
    ~ req.body -> name
./login
    ~ req.body -> username, password

/promotions
./get
    ~ req.body -> customer_id
./create
    ~ req.body -> amount, point_type, customer_id

/listings
./getListing
    ~ req.body -> ??
./getListingById
    ~ req.body -> company_id
./create
    ~ req.body -> name, description , coupon_type, points_required, valid_start, valid_end, company_id
./delete
    ~ req.body -> id

/points
./get
    ~ req.body -> customer_id
./create    
    ~ req.body -> transaction_date, amount, point_type, customer_id
./pointredeem
    ~ req.body -> transaction_date, amount, point_type, customer_id
./totalpoints
    ~ req.body -> customer_id

/transactions
./get
    ~ req.body -> customer_id
./create
    ~req.body -> transaction_date, amount, payment_method, collect_point, is_refund, store_user_id, customer_id

/coupontransactions
./get
    ~ req.body -> customer_id
./post
    ~ req.body -> total, quantity, transaction_date, listing_id, customer_id

/coupons
./get
    ~ req.body -> customer_id
./post
    ~ req.body -> transaction_date, name, description, expiry, is_used, is_expired, customer_id

