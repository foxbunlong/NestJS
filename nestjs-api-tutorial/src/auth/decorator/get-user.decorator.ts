import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx
      .switchToHttp() // Differ by protocol
      .getRequest();
    return request.user;
  },
);
