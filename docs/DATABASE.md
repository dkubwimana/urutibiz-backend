# Neon Database Configuration Guide

## Database Details
- **Provider**: Neon (Serverless PostgreSQL)
- **Host**: ep-wandering-dew-a8rs9ep6-pooler.eastus2.azure.neon.tech
- **Port**: 5432
- **Database**: urutibizdb
- **Username**: neondb_owner
- **SSL**: Required

## Connection String
```
postgresql://neondb_owner:npg_vKmLiNQ1O5wh@ep-wandering-dew-a8rs9ep6-pooler.eastus2.azure.neon.tech:5432/urutibizdb?sslmode=require
```

## Environment Variables
Make sure your `.env` file contains:
```
DB_HOST=ep-wandering-dew-a8rs9ep6-pooler.eastus2.azure.neon.tech
DB_PORT=5432
DB_NAME=urutibizdb
DB_USER=neondb_owner
DB_PASSWORD=npg_vKmLiNQ1O5wh
DB_SSL=true
```

## Testing Connection
Run the database connection test:
```bash
npm run db:test
```

## Running Migrations
Once dependencies are installed, run:
```bash
npm run db:migrate
```

## Important Notes
1. **SSL is required** for Neon connections
2. The database is hosted on Azure East US 2
3. This is a pooled connection endpoint
4. The database supports all standard PostgreSQL features
5. Connection pooling is handled by Neon automatically

## Troubleshooting
- Ensure SSL is enabled in your connection configuration
- Check that the password is correctly set in environment variables
- Verify network connectivity to Azure East US 2 region
- Use the pooler endpoint for production connections
