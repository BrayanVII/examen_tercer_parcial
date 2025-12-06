import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { RolService } from '../services/rol.service';

@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  findAll() {
    return this.rolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rolService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.rolService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.rolService.update(id, data);
  }
}
