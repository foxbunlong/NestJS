import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserDecorator = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx
      .switchToHttp() // Differ by protocol
      .getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
