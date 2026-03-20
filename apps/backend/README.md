<div align="center">
    <img style="background-color:rgb(241, 94, 26); padding: 10px;" src='https://cdn.discordapp.com/attachments/942065504221290576/980914857010425906/logo.png' alt="logo">
</div>

## Description

เป็น API ที่ใช้ในระบบ [Thaieconomap](https:demo2.thaieconomap.com) (แผนที่เศรษกิจชุมชน) สร้างจาก Nest Framwork ด้วย Typescript

## Installation

```bash
$ npm installl
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Endpoints
```
# development
https://dev.api.thaieconomap.com/
# production
https://v1.api.thaieconomap.com/
```

## API Reference

#### Get all districts

```http
  GET /map/districts
```

#### Get all shops

```http
  GET /commercials
```

#### Get shop by id

```http
  GET /commercials/:commercialId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `commercialId`      | `string` | **Required**. Id of shop |

#### Create pending commercial

```http
  POST /pending-commercials
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of shop |
| `type`      | `string` | **Required**. Type of shop |
| `latitude`      | `number` | **Required**. Latitude of shop |
| `longitude`      | `number` | **Required**. Longitude of shop |
| `imageUrl`      | `string` | **Required**. ImageUrl of shop |
| `openingDays`      | `string` | **Required**. OpeningDays of shop |
| `opening`      | `object` | **Required**. Array of shop's opening |
| `address`      | `string` | **Required**. Address of shop |
| `owner`      | `string` | **Required**. Owner of shop |
| `phoneNumber`      | `string` | **Required**. PhoneNumber of shop |

#### Update commercial

```http
  PATCH /pending-commercials
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `commercialId`| `string` | **Required** Id of commercial |
| `name`      | `string` | **Required**. Name of shop |
| `type`      | `string` | **Required**. Type of shop |
| `latitude`      | `number` | **Required**. Latitude of shop |
| `longitude`      | `number` | **Required**. Longitude of shop |
| `imageUrl`      | `string` | **Required**. ImageUrl of shop |
| `openingDays`      | `string` | **Required**. OpeningDays of shop |
| `opening`      | `object` | **Required**. Array of shop's opening |
| `address`      | `string` | **Required**. Address of shop |
| `owner`      | `string` | **Required**. Owner of shop |
| `phoneNumber`      | `string` | **Required**. PhoneNumber of shop |

## ยังไม่ implement auth module ควรเป็น manager level

#### Get pending commercials
```http
  GET /admin/pending-commercials
```
#### Approve a pending commmercial
```http
  POST /admin/pending-commercials/:pendingCommercialId/approve
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pendingCommercialId`      | `string` | **Required**. Id of the pending commercial Id |
#### Reject a pending commercial
```http
  POST /admin/pending-commercials/:pendingCommercialId/reject
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pendingCommercialId`      | `string` | **Required**. Id of the pending commercial Id |
#### Approve an updated pending commmercial
```http
  PUT /admin/pending-commercials/:pendingCommercialId/approve
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pendingCommercialId`      | `string` | **Required**. Id of the pending commercial Id |
#### Reject an updated pending commercial
```http
  PUT /admin/pending-commercials/:pendingCommercialId/reject
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `pendingCommercialId`      | `string` | **Required**. Id of the pending commercial Id |

## License

Nest is [MIT licensed](LICENSE).
