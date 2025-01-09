# Notification Management Service

Backend HTTP service for managing user notification preferences and sending notifications based on those preferences.

---

## **Features**

1. **Send Message**: Send message to channels saved on preferences.
2. **Manage Preferences**: Create or Update preferences

---

## **Setup**


#### **Run Services with Docker Compose**
- Start the services:
  ```bash
  docker-compose up --build
  ```
- Access the services:
  - **User Notifications Manager**: Accessible on port `8080`.
  - **Notification Service**: Accessible on port `5001`.

#### **Stop Services**
- Shut down the services:
  ```bash
  docker-compose down
  ```

## **Endpoints**

#### Send Notifications  

```http
  Post /message
```  

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `userId`  | `string` | **Required** |

Response:
- 200 OK
```
{
    "status": "success",
    "sentStatus": "status of sent",
    "data": "error description if exists"
}

sentStatuse can be:
- sent
- partiallySent - if some channel sent and some not.
- empty - there are not channels to send
```
- 400 Bad Request
- 401 Unauthorized
- 500 Error - when all sent failed, payload includes description

#### Create Preferences

~~~http
  POST /preferences
~~~

| Parameter | Type     | Description                       |
| :-------- | :------- | :---------- |
| `phone`  | `string` | **Optional** |
| `email` | `string` | **Required** |
| `preferences` | `{ email: boolean, sms: boolean }` | **Required**

Response: 
- 200 OK: user preferences object
```
{
  "status": "sucess"
  "data":  "userId": "string",
    "email": "string",
    "telephone": "string",
    "preferences": {
        "email": boolean,
        "sms": boolean
    }
}
```
- 401 Unauthorized
- 400 Bad Request - Invalid Paramters
- 500 Internal server Error

~~~http
  PUT /preferences/:userId
~~~

| Parameter | Type     | Description                       |
| :-------- | :------- | :---------- |
| `userId`  | `string` | **Required**
| `phone`  | `string` | **Optional** |
| `email` | `string` | **Optional** |
| `preferences` | `{ email: boolean, sms: boolean }` | **Optional**

Response: as create preferences request

---
## **Testing**

### **Send Notification Example**
```bash
curl -X POST http://localhost:8080/message \
-H "Authorization: Bearer onlyvim2024" \
-H "Content-Type: application/json" \
-d '{
  "userId": 1,
  "message": "Hello, this is a notification!"
}'
```

### **Add User Example**
```bash
curl -X POST http://localhost:8080/preferences \
-H "Authorization: Bearer onlyvim2024" \
-H "Content-Type: application/json" \
-d '{
  "email": "newuser@example.com",
  "preferences": { "email": true, "sms": true }
}'
```
--- 
TODO
- Add unit & e2e Testing
- Add Swagger
- Schema Validation
