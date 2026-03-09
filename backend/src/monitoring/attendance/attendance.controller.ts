import { Controller, Get } from '@nestjs/common';

@Controller('monitoring/attendance')
export class AttendanceController {
  @Get()
  getAttendanceHeatmap() {
    // Generating some dummy heatmap data
    const generateData = (): number[][] => {
      const data: number[][] = [];
      for (let i = 0; i < 7; i++) {
        const row: number[] = [];
        for (let j = 0; j < 12; j++) {
          row.push(Math.floor(Math.random() * 100));
        }
        data.push(row);
      }
      return data;
    };

    return {
      labelsX: [
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
      labelsY: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: generateData(),
      legend: [
        { label: '<80%', color: '#BE123C' },
        { label: '80-95%', color: '#D4A017' },
        { label: '>95%', color: '#10B981' },
      ],
    };
  }
}
