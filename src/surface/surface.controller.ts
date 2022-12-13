import { Controller, Get, Render } from '@nestjs/common';

@Controller('')
export class SurfaceController {

  @Get('')
    @Render('front')
    front() {
        return {message: "this is the front page that everone looks at."}
  }

}
