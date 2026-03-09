import { Controller, Get, Post, Body, Query, Param, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RBAcGuard, RBAcPermissions } from 'nestjs-rbac';

@ApiTags('Finance')
@Controller('transactions')
@UseGuards(JwtAuthGuard, RBAcGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  @RBAcPermissions('transactions.view')
  @ApiOperation({ summary: 'List all transactions with filters' })
  findAllTransactions(@Query() query: any) {
    return this.financeService.findAllTransactions(query);
  }

  @Get(':id')
  @RBAcPermissions('transactions.view')
  findOneTransaction(@Param('id') id: string) {
    return this.financeService.findOneTransaction(id);
  }

  @Get('invoices')
  @RBAcPermissions('transactions.view') // Assuming invoices are part of transactions view
  findAllInvoices(@Query() query: any) {
    return this.financeService.findAllInvoices(query);
  }

  @Post('reports/generate')
  @RBAcPermissions('transactions.create') // Assuming report generation is a create action
  generateReport(@Body() dto: any) {
    return this.financeService.generateReport(dto);
  }
}
