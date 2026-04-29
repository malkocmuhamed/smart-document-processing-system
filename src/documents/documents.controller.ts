import { Controller, Get } from '@nestjs/common';

@Controller('documents')
export class DocumentsController {
    @Get()
    getAll() {
        return 'Documents endpoint working';
    }
}
