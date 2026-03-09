import { Controller, Get } from '@nestjs/common';

@Controller('monitoring/grading')
export class GradingController {
  @Get()
  getGradingData() {
    return [
      {
        id: 1,
        label: 'Mid Term Exam',
        status: 'Open',
        children: [
          {
            label: 'Inputted',
            value: '1,245',
            status: 'Completed',
            color: 'emerald',
          },
          {
            label: 'Pending',
            value: '124',
            status: 'Pending',
            color: 'amber',
          },
          {
            label: 'Approved',
            value: '1,100',
            status: 'Approved',
            color: 'emerald',
          },
        ],
      },
      {
        id: 2,
        label: 'Final Exam',
        status: 'Closed',
        children: [
          {
            label: 'Inputted',
            value: '1,245',
            status: 'Completed',
            color: 'emerald',
          },
          {
            label: 'Pending',
            value: '0',
            status: 'Pending',
            color: 'emerald',
          },
          {
            label: 'Approved',
            value: '1,245',
            status: 'Approved',
            color: 'emerald',
          },
        ],
      },
    ];
  }
}
