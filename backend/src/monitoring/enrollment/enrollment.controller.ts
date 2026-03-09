import { Controller, Get } from '@nestjs/common';

@Controller('monitoring/enrollment')
export class EnrollmentController {
  @Get()
  getEnrollmentData() {
    return {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: 'TK',
          data: [420, 510, 400, 580, 420, 600, 450, 520, 480, 620, 580, 400],
          color: '#3b82f6',
        },
        {
          label: 'SD',
          data: [620, 710, 600, 780, 620, 800, 650, 720, 680, 820, 780, 600],
          color: '#D4A017',
        },
        {
          label: 'SMP',
          data: [820, 750, 650, 880, 720, 650, 920, 850, 700, 880, 850, 650],
          color: '#BE123C',
        },
        {
          label: 'SMA',
          data: [720, 650, 550, 780, 620, 550, 820, 750, 600, 780, 750, 550],
          color: '#10b981',
        },
      ],
    };
  }
}
