# 🔐 API Gateway + Auth Service Setup Guide

## 📋 Overview

**Goal:** Setup APISIX Gateway with Auth Service supporting 3 roles:
- **ADMIN** - Full system access
- **RECEPTIONIST** - Staff access (ticket validation, F&B management)
- **GUEST** - Public access (browse, book tickets)

---

## 🎯 STEP 1: Update Role Enum

### **File:** `libs/common/src/enums/identity.enum.ts`

```typescript
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

// Add Role enum
export enum Role {
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST',
  GUEST = 'GUEST',
}

// Add Permission enum (optional, for fine-grained control)
export enum Permission {
  // Movie Management
  MOVIE_CREATE = 'MOVIE_CREATE',
  MOVIE_UPDATE = 'MOVIE_UPDATE',
  MOVIE_DELETE = 'MOVIE_DELETE',
  MOVIE_VIEW = 'MOVIE_VIEW',
  
  // Cinema Management
  CINEMA_CREATE = 'CINEMA_CREATE',
  CINEMA_UPDATE = 'CINEMA_UPDATE',
  CINEMA_DELETE = 'CINEMA_DELETE',
  CINEMA_VIEW = 'CINEMA_VIEW',
  
  // Showtime Management
  SHOWTIME_CREATE = 'SHOWTIME_CREATE',
  SHOWTIME_UPDATE = 'SHOWTIME_UPDATE',
  SHOWTIME_DELETE = 'SHOWTIME_DELETE',
  SHOWTIME_VIEW = 'SHOWTIME_VIEW',
  
  // Booking Management
  BOOKING_CREATE = 'BOOKING_CREATE',
  BOOKING_VIEW = 'BOOKING_VIEW',
  BOOKING_VIEW_ALL = 'BOOKING_VIEW_ALL',
  BOOKING_CANCEL = 'BOOKING_CANCEL',
  BOOKING_VALIDATE = 'BOOKING_VALIDATE', // For receptionist
  
  // F&B Management
  FNB_CREATE = 'FNB_CREATE',
  FNB_UPDATE = 'FNB_UPDATE',
  FNB_DELETE = 'FNB_DELETE',
  FNB_VIEW = 'FNB_VIEW',
  FNB_ORDER = 'FNB_ORDER', // For receptionist
  
  // User Management
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_VIEW = 'USER_VIEW',
  USER_VIEW_ALL = 'USER_VIEW_ALL',
  
  // Reports
  REPORT_VIEW = 'REPORT_VIEW',
  REPORT_EXPORT = 'REPORT_EXPORT',
}
```

### **Export in:** `libs/common/src/enums/index.ts`

```typescript
export * from './app.enum';
export * from './environment.enum';
export * from './file.enum';
export * from './identity.enum'; // This should already export Role now
export * from './jwt.enum';
```

---

## 🎯 STEP 2: Create Role-Permission Mapping

### **File:** `libs/common/src/constants/role-permissions.ts`

```typescript
import { Permission, Role } from '../enums';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // Full access to everything
    Permission.MOVIE_CREATE,
    Permission.MOVIE_UPDATE,
    Permission.MOVIE_DELETE,
    Permission.MOVIE_VIEW,
    
    Permission.CINEMA_CREATE,
    Permission.CINEMA_UPDATE,
    Permission.CINEMA_DELETE,
    Permission.CINEMA_VIEW,
    
    Permission.SHOWTIME_CREATE,
    Permission.SHOWTIME_UPDATE,
    Permission.SHOWTIME_DELETE,
    Permission.SHOWTIME_VIEW,
    
    Permission.BOOKING_CREATE,
    Permission.BOOKING_VIEW,
    Permission.BOOKING_VIEW_ALL,
    Permission.BOOKING_CANCEL,
    Permission.BOOKING_VALIDATE,
    
    Permission.FNB_CREATE,
    Permission.FNB_UPDATE,
    Permission.FNB_DELETE,
    Permission.FNB_VIEW,
    Permission.FNB_ORDER,
    
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.USER_VIEW,
    Permission.USER_VIEW_ALL,
    
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
  ],
  
  [Role.RECEPTIONIST]: [
    // View movies, cinemas, showtimes
    Permission.MOVIE_VIEW,
    Permission.CINEMA_VIEW,
    Permission.SHOWTIME_VIEW,
    
    // Manage bookings (validate tickets)
    Permission.BOOKING_VIEW,
    Permission.BOOKING_VALIDATE,
    
    // Manage F&B orders
    Permission.FNB_VIEW,
    Permission.FNB_ORDER,
    
    // View own profile
    Permission.USER_VIEW,
  ],
  
  [Role.GUEST]: [
    // Public access only
    Permission.MOVIE_VIEW,
    Permission.CINEMA_VIEW,
    Permission.SHOWTIME_VIEW,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_VIEW, // Own bookings only
    Permission.BOOKING_CANCEL, // Own bookings only
    Permission.FNB_VIEW,
  ],
};

// Helper function to check permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Helper function to check multiple permissions
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Helper function to check all permissions
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}
```

---

## 🎯 STEP 3: Create Role Guard

### **File:** `libs/common/src/guards/roles.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
```

### **File:** `libs/common/src/guards/permissions.guard.ts`

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums';
import { PERMISSIONS_KEY } from '../decorators';
import { hasAnyPermission } from '../constants/role-permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      return false;
    }

    return hasAnyPermission(user.role, requiredPermissions);
  }
}
```

---

## 🎯 STEP 4: Create Decorators

### **File:** `libs/common/src/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

### **File:** `libs/common/src/decorators/permissions.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';
import { Permission } from '../enums';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

### **Update:** `libs/common/src/decorators/index.ts`

```typescript
export * from './roles.decorator';
export * from './permissions.decorator';
// ... other decorators
```

---

## 🎯 STEP 5: Update Auth Service

### **File:** `apps/auth-service/src/modules/auth/dto/sign-up.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@app/common';

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ 
    enum: Role, 
    example: Role.GUEST,
    description: 'User role. Default is GUEST. Only ADMIN can create ADMIN/RECEPTIONIST users.'
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

export class SignUpResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
```

### **Update:** `apps/auth-service/src/modules/auth/auth.service.ts`

```typescript
// In signUp method, update line 102:
async signUp(body: SignUpDto): Promise<SignUpResponseDto> {
  const userData = {
    ...body,
    isActive: true,
    emailVerified: false,
    role: body.role || Role.GUEST, // Default to GUEST if not specified
  };
  
  const newUser = await this.msResponse(
    this.userClientTCP.send(UserMessagePattern.CREATE_USER, userData),
  );

  return this.manageUserToken(newUser);
}
```

---

## 🎯 STEP 6: Update APISIX Configuration

### **File:** `config/apisix/conf/apisix-dev.yaml`

Add new services for cinema management:

```yaml
services:
  # ... existing services (Home, auth-service, user-service, notification-service)
  
  # Movie Service
  - name: movie-service
    plugins:
      jwt-auth:
        _meta:
          disable: false
        store_in_ctx: true
    routes:
      # Public routes (no auth required)
      - methods:
          - GET
        name: movie-route-public
        plugins:
          jwt-auth:
            _meta:
              disable: true
          proxy-rewrite:
            regex_uri:
              - ^/movie-service/(.*)
              - /$1
        priority: 1
        uris:
          - /movie-service/api
          - /movie-service/api/movies
          - /movie-service/api/movies/*
          - /movie-service/api/genres
          - /movie-service/swagger
          - /movie-service/swagger/*
      
      # Protected routes (auth required)
      - methods:
          - POST
          - PUT
          - DELETE
          - PATCH
        name: movie-route-protected
        plugins:
          proxy-rewrite:
            regex_uri:
              - ^/movie-service/(.*)
              - /$1
          jwt-auth:
            _meta:
              disable: false
            store_in_ctx: true
          serverless-post-function:
            _meta:
              disable: false
              priority: -1000
            functions:
              - |-
                return function(conf, ctx)
                  local core = require("apisix.core")
                  local payload = ctx.jwt_auth_payload
                  local header_value = ""

                  if payload then
                    local ok, res = pcall(require, "cjson")
                    if ok then
                        header_value = res.encode(payload)
                        ngx.log(ngx.NOTICE, "JWT Claims (JSON) set to X-Auth-User.")
                    else
                        ngx.log(ngx.ERR, "Error requiring cjson. Cannot serialize JWT payload. Setting X-Auth-User to empty string.")
                    end
                  else
                    ngx.log(ngx.NOTICE, "JWT Payload not found in context. Setting X-Auth-User to empty string.")
                  end

                  core.request.set_header(ctx, "x-auth-user", header_value)
                end
            phase: access
        priority: 0
        uris:
          - /movie-service/*
    upstream:
      keepalive_pool:
        idle_timeout: 60
        requests: 1000
        size: 320
      name: movie-upstream
      nodes:
        - host: ${APISIX_MOVIE_SERVICE_HOST}
          port: ${APISIX_MOVIE_SERVICE_PORT}
          priority: 0
          weight: 1
      pass_host: pass
      scheme: http
      timeout:
        connect: 6
        read: 6
        send: 6
      type: roundrobin

  # Cinema Service
  - name: cinema-service
    plugins:
      jwt-auth:
        _meta:
          disable: false
        store_in_ctx: true
    routes:
      # Public routes
      - methods:
          - GET
        name: cinema-route-public
        plugins:
          jwt-auth:
            _meta:
              disable: true
          proxy-rewrite:
            regex_uri:
              - ^/cinema-service/(.*)
              - /$1
        priority: 1
        uris:
          - /cinema-service/api
          - /cinema-service/api/cinemas
          - /cinema-service/api/cinemas/*
          - /cinema-service/api/theaters/*
          - /cinema-service/swagger
          - /cinema-service/swagger/*
      
      # Protected routes
      - methods:
          - POST
          - PUT
          - DELETE
          - PATCH
        name: cinema-route-protected
        plugins:
          proxy-rewrite:
            regex_uri:
              - ^/cinema-service/(.*)
              - /$1
          jwt-auth:
            _meta:
              disable: false
            store_in_ctx: true
          serverless-post-function:
            _meta:
              disable: false
              priority: -1000
            functions:
              - |-
                return function(conf, ctx)
                  local core = require("apisix.core")
                  local payload = ctx.jwt_auth_payload
                  local header_value = ""

                  if payload then
                    local ok, res = pcall(require, "cjson")
                    if ok then
                        header_value = res.encode(payload)
                    end
                  end

                  core.request.set_header(ctx, "x-auth-user", header_value)
                end
            phase: access
        priority: 0
        uris:
          - /cinema-service/*
    upstream:
      keepalive_pool:
        idle_timeout: 60
        requests: 1000
        size: 320
      name: cinema-upstream
      nodes:
        - host: ${APISIX_CINEMA_SERVICE_HOST}
          port: ${APISIX_CINEMA_SERVICE_PORT}
          priority: 0
          weight: 1
      pass_host: pass
      scheme: http
      timeout:
        connect: 6
        read: 6
        send: 6
      type: roundrobin

  # Booking Service
  - name: booking-service
    plugins:
      jwt-auth:
        _meta:
          disable: false
        store_in_ctx: true
    routes:
      # Public routes (guest checkout)
      - methods:
          - POST
        name: booking-route-guest
        plugins:
          jwt-auth:
            _meta:
              disable: true
          proxy-rewrite:
            regex_uri:
              - ^/booking-service/(.*)
              - /$1
        priority: 1
        uris:
          - /booking-service/api/bookings/guest
          - /booking-service/api/bookings/lock-seats
      
      # Protected routes
      - methods:
          - GET
          - POST
          - PUT
          - DELETE
          - PATCH
        name: booking-route-protected
        plugins:
          proxy-rewrite:
            regex_uri:
              - ^/booking-service/(.*)
              - /$1
          jwt-auth:
            _meta:
              disable: false
            store_in_ctx: true
          serverless-post-function:
            _meta:
              disable: false
              priority: -1000
            functions:
              - |-
                return function(conf, ctx)
                  local core = require("apisix.core")
                  local payload = ctx.jwt_auth_payload
                  local header_value = ""

                  if payload then
                    local ok, res = pcall(require, "cjson")
                    if ok then
                        header_value = res.encode(payload)
                    end
                  end

                  core.request.set_header(ctx, "x-auth-user", header_value)
                end
            phase: access
        priority: 0
        uris:
          - /booking-service/*
    upstream:
      keepalive_pool:
        idle_timeout: 60
        requests: 1000
        size: 320
      name: booking-upstream
      nodes:
        - host: ${APISIX_BOOKING_SERVICE_HOST}
          port: ${APISIX_BOOKING_SERVICE_PORT}
          priority: 0
          weight: 1
      pass_host: pass
      scheme: http
      timeout:
        connect: 6
        read: 6
        send: 6
      type: roundrobin
```

---

## 🎯 STEP 7: Update Environment Variables

### **File:** `.env.example`

```bash
# ... existing vars

# Movie Service
APISIX_MOVIE_SERVICE_HOST=movie-service
APISIX_MOVIE_SERVICE_PORT=3003

# Cinema Service
APISIX_CINEMA_SERVICE_HOST=cinema-service
APISIX_CINEMA_SERVICE_PORT=3004

# Booking Service
APISIX_BOOKING_SERVICE_HOST=booking-service
APISIX_BOOKING_SERVICE_PORT=3005

# Showtime Service
APISIX_SHOWTIME_SERVICE_HOST=showtime-service
APISIX_SHOWTIME_SERVICE_PORT=3006

# Payment Service
APISIX_PAYMENT_SERVICE_HOST=payment-service
APISIX_PAYMENT_SERVICE_PORT=3007
```

---

## 🎯 STEP 8: Usage Examples

### **Example 1: Protect Admin-Only Endpoint**

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, Role } from '@app/common';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  
  // Public endpoint - anyone can access
  @Get()
  async getMovies() {
    return this.movieService.findAll();
  }
  
  // Admin only - create movie
  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  async createMovie(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto);
  }
}
```

### **Example 2: Multiple Roles**

```typescript
import { Controller, Get, Post } from '@nestjs/common';
import { Roles, Role } from '@app/common';

@Controller('bookings')
export class BookingController {
  
  // ADMIN and RECEPTIONIST can validate tickets
  @Post('validate')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.RECEPTIONIST)
  async validateTicket(@Body() dto: ValidateTicketDto) {
    return this.bookingService.validate(dto);
  }
}
```

### **Example 3: Permission-Based**

```typescript
import { Controller, Get } from '@nestjs/common';
import { Permissions, Permission } from '@app/common';

@Controller('reports')
export class ReportController {
  
  @Get('sales')
  @ApiBearerAuth()
  @Permissions(Permission.REPORT_VIEW)
  async getSalesReport() {
    return this.reportService.getSales();
  }
  
  @Get('export')
  @ApiBearerAuth()
  @Permissions(Permission.REPORT_EXPORT)
  async exportReport() {
    return this.reportService.export();
  }
}
```

---

## 🎯 STEP 9: Testing

### **1. Create Admin User**

```bash
curl -X POST http://localhost:9080/auth-service/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cinema.com",
    "password": "Admin123!",
    "fullName": "Admin User",
    "role": "ADMIN"
  }'
```

### **2. Create Receptionist User**

```bash
curl -X POST http://localhost:9080/auth-service/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "receptionist@cinema.com",
    "password": "Receptionist123!",
    "fullName": "Receptionist User",
    "role": "RECEPTIONIST"
  }'
```

### **3. Create Guest User**

```bash
curl -X POST http://localhost:9080/auth-service/api/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@cinema.com",
    "password": "Guest123!",
    "fullName": "Guest User"
  }'
```

### **4. Login and Get Token**

```bash
curl -X POST http://localhost:9080/auth-service/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cinema.com",
    "password": "Admin123!"
  }'
```

### **5. Test Protected Endpoint**

```bash
curl -X POST http://localhost:9080/movie-service/api/movies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Movie",
    "duration": 120
  }'
```

---

## ✅ CHECKLIST

### **Phase 1: Core Setup**
- [ ] Update Role enum in `libs/common/src/enums/identity.enum.ts`
- [ ] Create Permission enum
- [ ] Create role-permissions mapping
- [ ] Create RolesGuard
- [ ] Create PermissionsGuard
- [ ] Create decorators (@Roles, @Permissions)
- [ ] Export all in `libs/common/src/index.ts`

### **Phase 2: Auth Service**
- [ ] Update SignUpDto to include role
- [ ] Update auth.service.ts signUp method
- [ ] Test sign-up with different roles

### **Phase 3: API Gateway**
- [ ] Update APISIX config with new services
- [ ] Add public routes (no JWT)
- [ ] Add protected routes (JWT required)
- [ ] Add environment variables
- [ ] Test routes with Postman/curl

### **Phase 4: Service Implementation**
- [ ] Apply @Roles decorator to controllers
- [ ] Apply @Permissions decorator where needed
- [ ] Add RolesGuard to app module
- [ ] Add PermissionsGuard to app module
- [ ] Test authorization

---

## 📊 ROLE SUMMARY

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **ADMIN** | Full access | All permissions |
| **RECEPTIONIST** | Staff access | View content, validate tickets, manage F&B orders |
| **GUEST** | Public access | Browse, book tickets, view own bookings |

---

**Created:** 2026-02-04  
**Version:** 1.0  
**Status:** Ready for Implementation
