import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Hàm này xử lý các lỗi và trả về một phản hồi HTTP phù hợp.
 * @param error - Lỗi cần xử lý.
 * @returns Phản hồi HTTP phù hợp với lỗi.
 */
export function handleError(error: any): never {
  if (error instanceof HttpException) {
    throw error;
  }

  const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal server error';

  throw new HttpException(
    {
      status: statusCode,
      error: message,
    },
    statusCode,
  );
}
