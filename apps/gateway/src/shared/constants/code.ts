import { HttpStatus } from '@nestjs/common';

import { ICodeObj } from '../interfaces';

export const CODES: ICodeObj = {
  AGW_000: {
    code: 'AGW-000',
    message: 'Success',
    display: 'ทำรายการสำเร็จ',
    statusCode: HttpStatus.OK,
  },
  AGW_001: {
    code: 'AGW-001',
    message: 'Invalid request',
    display: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  AGW_002: {
    code: 'AGW-002',
    message: 'Unauthorized',
    display: 'พบข้อผิดพลาดในการตรวจสอบสิทธิ์ในการเข้าถึงข้อมูล',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  AGW_003: {
    code: 'AGW-003',
    message: 'Forbidden',
    display: 'ไม่สามารถเข้าถึงข้อมูลได้',
    statusCode: HttpStatus.FORBIDDEN,
  },
  AGW_004: {
    code: 'AGW-004',
    message: 'Internal server error',
    display: 'พบข้อผิดพลาดในการทำรายการ',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  AGW_005: {
    code: 'AGW-005',
    message: 'User not found',
    display: 'ไม่พบข้อมูลผู้ใช้',
    statusCode: HttpStatus.NOT_FOUND,
  },
  AGW_006: {
    code: 'AGW-006',
    message: 'Line Service Error',
    display: 'ไม่สามารถดึงข้อมูลจากไลน์ได้',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
  },
  AGW_007: {
    code: 'AGW-007',
    message: 'Facebook Service Error',
    display: 'ไม่สามารถดึงข้อมูลจากเฟซบุ๊ก',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
  },
  AGW_008: {
    code: 'AGW-008',
    message: 'Invalid file',
    display: 'ไฟล์ที่อัพโหลดมีปัญหา',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  AGW_009: {
    code: 'AGW-09',
    message: 'Failed to manage file',
    display: 'ไม่สามารถจัดการไฟล์ดังกล่าวได้',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
  },
  AGW_010: {
    code: 'AGW-010',
    message: 'File not found',
    display: 'ไม่พบไฟล์ข้อมูล',
    statusCode: HttpStatus.NOT_FOUND,
  },
  AGW_011: {
    code: 'AGW-011',
    message: 'Filetype not supported',
    display: 'ประเภทไฟล์ไม่ถูกต้อง',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  AGW_012: {
    code: 'AGW-012',
    message: 'File too large',
    display: 'ขนาดไฟล์ใหญ่เกินไป',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  AGW_013: {
    code: 'AGW-013',
    message: 'Failed to create new account',
    display: 'ไม่สามารถสร้างบัญชีได้ในขณะนี้',
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
  },
};
