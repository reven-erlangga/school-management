import { Controller, Get } from '@nestjs/common';

@Controller('monitoring/finance')
export class FinanceController {
  @Get()
  getFinanceData() {
    return {
      labels: [
        'Week 1',
        'Week 2',
        'Week 3',
        'Week 4',
        'Week 5',
        'Week 6',
        'Week 7',
        'Week 8',
        'Week 9',
        'Week 10',
        'Week 11',
      ],
      datasets: [
        {
          label: 'Invoiced',
          data: [35, 25, 28, 40, 30, 35, 42, 32, 28, 30, 25],
          color: '#A35C14',
        },
        {
          label: 'Collected',
          data: [55, 45, 50, 65, 50, 60, 70, 58, 52, 55, 45],
          color: '#D4A017',
        },
        {
          label: 'Overdue',
          data: [12, 10, 8, 15, 12, 9, 14, 11, 13, 10, 12],
          color: '#BE123C',
        },
      ],
    };
  }
}
