curl -X POST http://localhost:8080/api/auth/sign-up/email \
-H "Content-Type: application/json" \
-d '{
    "username": "johnny",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "12345678"
}
'