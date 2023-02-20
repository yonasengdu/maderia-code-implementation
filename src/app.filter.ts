import { Catch, HttpException, Redirect } from '@nestjs/common';


@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    return response.render('error.hbs', {message: exception.message});
  }
}