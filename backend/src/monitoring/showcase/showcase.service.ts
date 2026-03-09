import { Injectable } from '@nestjs/common';

@Injectable()
export class ShowcaseService {
  getShowcaseData() {
    return {
      totalStudent: {
        label: 'Total Students',
        value: '1,245',
        trend: '+3.2%',
        trendType: 'up',
      },
      totalAttendance: {
        label: 'Today Attendance',
        value: '92.4%',
        trend: '-1.5%',
        trendType: 'down',
      },
      invoices: {
        label: 'Invoices',
        paidAmount: 'Rp.920M',
        paidCount: 184,
        overdueAmount: 'Rp.920M',
        overdueCount: 27,
      },
      issues: {
        label: 'Open Issues',
        value: 12,
        pending: 5,
        exceptions: 7,
      },
      gradeBudget: {
        label: 'Grade Budget',
        unit: 'SMA',
        total: 'Rp 450.000.000',
        used: 'Rp 320.000.000',
        remaining: 'Rp 130.000.000',
      },
    };
  }
}
