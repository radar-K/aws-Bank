## Database Structure

The project uses two main tables:

1. **users** - Stores user information

   - id (primary key)
   - username
   - password

2. **transactions** - Stores all financial transactions
   - id (primary key)
   - user_id (foreign key to users.id)
   - type (deposit, expense, transfer)
   - amount
   - description
   - category
   - recipient
   - date
