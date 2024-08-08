import { Injectable, OnInit } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle,
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle, hexToRgba } from '@coreui/utils';
import { AttendanceService } from '@app/services/attendance/attendance.service';
import { EmployeeService } from '@app/services/employee/employee.service';
import { Attendance } from '../attendance/attendance.component';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any',
})
export class DashboardChartsData implements OnInit {
  constructor(
    private atdService: AttendanceService,
    private empService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.initMainChart();
  }

  public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async initMainChart(period: string = 'Month') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';

    // mainChart
    this.mainChart['elements'] = period === 'Month' ? 12 : 27;
    this.mainChart['Data1'] = [];
    this.mainChart['Data2'] = [];
    this.mainChart['Data3'] = [];

    let newEAtdArr: any;
    let oldEAtdArr: any;

    this.atdService.getAll().subscribe((data) => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const newEAtds: Attendance[] = [];
      const oldEAtds: Attendance[] = [];

      data.map((emp) => {
        const hireDate = new Date(emp.employee.hireDate);
        if (hireDate > oneYearAgo) {
          newEAtds.push(emp);
        } else {
          oldEAtds.push(emp);
        }
      });

      const grByMMonthNewE = newEAtds
        .map((emp) => {
          return { ...emp, attendanceDate: new Date(emp.attendanceDate) };
        })
        .reduce((acc: any, emp) => {
          const monthYear =
            emp.attendanceDate.getMonth() +
            1 +
            '/' +
            emp.attendanceDate.getFullYear();
          if (!acc[monthYear]) {
            acc[monthYear] = {};
            const day = emp.attendanceDate.getDate();
            if (acc[monthYear][day]) {
              acc[monthYear][day] += 1;
            } else {
              acc[monthYear][day] = 1;
            }
          } else {
            const day = emp.attendanceDate.getDate();
            if (acc[monthYear][day]) {
              acc[monthYear][day] += 1;
            } else {
              acc[monthYear][day] = 1;
            }
          }
          return acc;
        }, {});

      const grByMMonthOldE = oldEAtds
        .map((emp) => {
          return { ...emp, attendanceDate: new Date(emp.attendanceDate) };
        })
        .reduce((acc: any, emp) => {
          const monthYear =
            emp.attendanceDate.getMonth() +
            1 +
            '/' +
            emp.attendanceDate.getFullYear();
          if (!acc[monthYear]) {
            acc[monthYear] = {};
            const day = emp.attendanceDate.getDate();
            if (acc[monthYear][day]) {
              acc[monthYear][day] += 1;
            } else {
              acc[monthYear][day] = 1;
            }
          } else {
            const day = emp.attendanceDate.getDate();
            if (acc[monthYear][day]) {
              acc[monthYear][day] += 1;
            } else {
              acc[monthYear][day] = 1;
            }
          }
          return acc;
        }, {});

      newEAtdArr = grByMMonthNewE;
      oldEAtdArr = grByMMonthOldE;
    });

    setTimeout(() => {
      // generate random values for mainChart
      for (let i = 0; i < this.mainChart['elements']; i++) {
        // this.mainChart['Data1'].push(this.random(50, 240));
        // this.mainChart['Data2'].push(this.random(20, 160));
        // this.mainChart['Data3'].push(65);
        if (period === 'Month') {
          const monthYear = i + 1 + '/' + new Date().getFullYear();
          const newSize = Object.keys(newEAtdArr[monthYear] ?? {}).length;
          const oldSize = Object.keys(oldEAtdArr[monthYear] ?? {}).length;
          
          this.mainChart['Data1'].push(newSize);
          this.mainChart['Data2'].push(oldSize);
          this.mainChart['Data3'].push(2);
        } else {
          const monthYear =
            new Date().getMonth() + 1 + '/' + new Date().getFullYear();
          const day = i + 1;
          
          this.mainChart['Data1'].push(newEAtdArr[monthYear]?.[day] ?? 0);
          this.mainChart['Data2'].push(oldEAtdArr[monthYear]?.[day] ?? 0);
          this.mainChart['Data3'].push(2);
        }
      }
    }, 300);

    let labels: string[] = [];
    if (period === 'Month') {
      labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
    } else {
      /* tslint:disable:max-line-length */
      const week = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      labels = week.concat(week, week, week);
    }

    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true,
      },
      {
        // brandSuccess
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff',
      },
      {
        // brandDanger
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5],
      },
    ];

    const datasets: ChartDataset[] = [
      {
        data: this.mainChart['Data1'],
        label: 'Employee',
        ...colors[0],
      },
      {
        data: this.mainChart['Data2'],
        label: 'New Employee',
        ...colors[1],
      },
      {
        data: this.mainChart['Data3'],
        label: 'BEP',
        ...colors[2],
      },
    ];

    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          labelColor: (context) =>
            ({
              backgroundColor: context.dataset.borderColor,
            } as TooltipLabelStyle),
        },
      },
    };

    const scales = this.getScales();

    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: {
          tension: 0.4,
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    setTimeout(() => {
      this.mainChart.data = {
        datasets,
        labels,
      };

    }, 300)
  }

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const scales: ScaleOptions<any> = {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false,
        },
        ticks: {
          color: colorBody,
        },
      },
      y: {
        border: {
          color: colorBorderTranslucent,
        },
        grid: {
          color: colorBorderTranslucent,
        },
        max: 15,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: Math.ceil(15 / 5),
        },
      },
    };
    return scales;
  }
}
