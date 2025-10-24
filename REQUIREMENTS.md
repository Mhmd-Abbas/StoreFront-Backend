# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index -> /Products [GET]
- Show -> /Products/:id [GET]
- Create [token required] -> /Products [POST]
- [OPTIONAL] Top 5 most popular products - in progress
- [OPTIONAL] Products by category (args: product category) - in progress

#### Users
- Index [token required] -> /Users [GET]
- Show [token required] -> /Users/:id [GET]
- Create [token required] -> /Users [POST]

#### Orders
- Current Order by user (args: user id)[token required] -> /Orders/Active/:user_id [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] /Orders/Completed/:user_id [GET]


## Data Shapes
#### Product
- id 
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)


## Database schema
#### Categories
- id: Number
- name: String

#### Products
- id: Number
- name: String
- price: Number
- category_id: Number [FK to Categories table]

#### Users
- id: Number
- firstname: String
- lastname: String
- password: String

#### Orders
- id: Number
- user_id: Number [FK to Users table]
- status: String

#### Order_Products
- id: Number
- order_id: Number [FK to Orders table]
- product_id: Number [FK to Products table]
- quantity: Number