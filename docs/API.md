# UrutiBiz Backend API Documentation

## Project Overview

The UrutiBiz Backend is a comprehensive TypeScript-based REST API that powers a modern booking and service management platform. Built with Express.js, PostgreSQL, and Redis, it provides a robust foundation for service providers and customers to connect and manage bookings.

## Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Cache**: Redis
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.IO
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── validators/      # Request validators
├── types/           # TypeScript types
└── interfaces/      # Interface definitions
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Copy environment file and configure:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
npm run db:migrate
npm run db:seed
```

4. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Password reset confirmation

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update current user profile
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Products/Services
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (providers only)
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Bookings
- `GET /api/v1/bookings` - Get user bookings
- `GET /api/v1/bookings/:id` - Get booking by ID
- `POST /api/v1/bookings` - Create booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Cancel booking

### Payments
- `POST /api/v1/payments/intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `GET /api/v1/payments/:id` - Get payment details
- `POST /api/v1/payments/refund` - Process refund

---

## Moderation & Automated Moderation API

### Configuration Management
- `GET    /api/v1/admin/moderation/config` &mdash; Get current moderation config
- `PUT    /api/v1/admin/moderation/config` &mdash; Update moderation config

### Rule Management
- `GET    /api/v1/admin/moderation/rules` &mdash; List moderation rules
- `POST   /api/v1/admin/moderation/rules` &mdash; Create a moderation rule
- `PUT    /api/v1/admin/moderation/rules/:id` &mdash; Update a moderation rule
- `DELETE /api/v1/admin/moderation/rules/:id` &mdash; Delete a moderation rule

### Queue & Analytics
- `GET    /api/v1/admin/moderation/queue` &mdash; Review moderation queue
- `GET    /api/v1/admin/moderation/metrics` &mdash; Moderation analytics/metrics
- `POST   /api/v1/admin/moderation/trigger` &mdash; Manually trigger moderation (content/user/booking)

#### Example: Manual Moderation Trigger
```json
POST /api/v1/admin/moderation/trigger
{
  "resourceType": "product",
  "resourceId": "abc123",
  "content": {
    "title": "Sample title",
    "description": "Sample description"
  }
}
```

#### Response
```json
{
  "id": "uuid",
  "resourceType": "product",
  "resourceId": "abc123",
  "ruleId": "rule-xyz",
  "ruleName": "No Profanity",
  "score": 0.8,
  "confidence": 0.9,
  "status": "flagged",
  "triggeredConditions": ["description"],
  "appliedActions": [
    { "type": "flag", "notification": true }
  ],
  "reviewRequired": false,
  "metadata": {},
  "createdAt": "2025-07-03T12:00:00Z",
  "updatedAt": "2025-07-03T12:00:00Z"
}
```

---

## Product Management API

- `GET    /api/v1/products` &mdash; List products with filters
- `POST   /api/v1/products` &mdash; Create a new product
- `GET    /api/v1/products/:id` &mdash; Get single product by ID
- `PUT    /api/v1/products/:id` &mdash; Update product by ID
- `DELETE /api/v1/products/:id` &mdash; Delete product by ID
- `POST   /api/v1/products/:id/images` &mdash; Upload images for a product

## Booking Management API

- `GET    /api/v1/bookings` &mdash; List user bookings
- `POST   /api/v1/bookings` &mdash; Create a new booking
- `GET    /api/v1/bookings/:id` &mdash; Get booking details by ID
- `POST   /api/v1/bookings/:id/confirm` &mdash; Confirm a booking
- `POST   /api/v1/bookings/:id/cancel` &mdash; Cancel a booking
- `POST   /api/v1/bookings/:id/checkin` &mdash; Start rental/check-in for a booking

---

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "error": any (development only)
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited:
- General endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Password reset: 3 requests per hour

## File Uploads

The API supports file uploads for:
- User profile images
- Product images
- Document attachments

Maximum file size: 10MB
Allowed types: jpg, jpeg, png, gif, pdf

## Real-time Features

Socket.IO is used for real-time features:
- Live chat between users and providers
- Booking status updates
- Notifications
- Admin dashboard updates

## Testing

Run the test suite:
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
```

## Deployment

### Docker
```bash
docker-compose up -d
```

### Manual Deployment
1. Build the project: `npm run build`
2. Set production environment variables
3. Run migrations: `npm run db:migrate`
4. Start the server: `npm start`

## Environment Variables

See `.env.example` for all available configuration options.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## Security

- All sensitive data is encrypted
- JWT tokens have expiration times
- Rate limiting prevents abuse
- Input validation and sanitization
- Security headers are set
- CORS is properly configured

## Monitoring

The API includes:
- Comprehensive logging with Winston
- Health check endpoint: `/health`
- Performance metrics
- Error tracking

## Support

For questions or issues, please contact the development team or create an issue in the repository.
