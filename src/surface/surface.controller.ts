import { Controller, Get, Render } from '@nestjs/common';

@Controller('')
export class SurfaceController {

    @Get('')
    front() {
        return "this is the front page that everone looks at."
    }

}
