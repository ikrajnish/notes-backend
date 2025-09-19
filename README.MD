# Notes App Backend 

This is the backend for the Notes Application.  
It is built with **Node.js, Express, and MongoDB**.  
The backend supports multiple companies (tenants), user roles, and subscription plans.

---

## Multi-Tenancy Approach

For this project, I used the **Shared Schema with Tenant ID** approach.  
This means:

- All tenants (like Acme and Globex) share the same database and collections.
- Each document (User, Note, Tenant) has a **tenantId** field.
- When a user makes a request, the backend checks the tenantId from the JWT token and only returns or modifies data for that tenant.
- This ensures strict isolation: one tenant can never access another tenant’s data.

I chose this approach because it is:
- Simple to implement for a beginner
- Easy to manage with Mongoose
- Works well for small and medium apps

---

## Features

- JWT-based login
- Roles: **Admin** and **Member**
- Tenants: **Acme** and **Globex**
- Free plan: max 3 notes
- Pro plan: unlimited notes
- Admin can invite new users
- Admin can upgrade tenant to Pro
- CRUD API for notes
- Health check endpoint

---

## Test Accounts

All test accounts use the password: **`password`**

 Tenant   Role    Email               
--------------------------------------
 Acme     Admin   admin@acme.test     
 Acme     Member  user@acme.test      
 Globex   Admin   admin@globex.test   
 Globex   Member  user@globex.test    

---

## API Routes

### Health
- `GET /health` → `{ "status": "ok" }`

### Auth
- `POST /auth/login` → login with email & password  
- `POST /auth/invite` → invite a new user (Admin only)

### Notes
- `POST /notes` → create a note (with Free plan limit check)  
- `GET /notes` → get all notes for tenant  
- `GET /notes/:id` → get one note  
- `PUT /notes/:id` → update note  
- `DELETE /notes/:id` → delete note  

### Tenant
- `POST /tenants/:slug/upgrade` → upgrade tenant to Pro (Admin only)

---
