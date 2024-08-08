import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  RowComponent,
  ColComponent,
  WidgetStatAComponent,
  TemplateIdDirective,
  ThemeDirective,
  DropdownComponent,
  ButtonDirective,
  DropdownToggleDirective,
  DropdownMenuDirective,
  DropdownItemDirective,
  DropdownDividerDirective,
} from '@coreui/angular';
import { EmployeeService } from '@app/services/employee/employee.service';
import { DepartmentsService } from '@app/services/department/departments.service';
import { SalarysService } from '@app/services/salary/salarys.service';
import { AttendanceService } from '@app/services/attendance/attendance.service';
import { forEach } from 'lodash-es';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    WidgetStatAComponent,
    TemplateIdDirective,
    IconDirective,
    ThemeDirective,
    DropdownComponent,
    ButtonDirective,
    DropdownToggleDirective,
    DropdownMenuDirective,
    DropdownItemDirective,
    RouterLink,
    DropdownDividerDirective,
    ChartjsComponent,
  ],
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  empTotal = 0;
  depTotal = 0;
  salTotal = 0;
  atdTotal = 0;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private empService: EmployeeService,
    private depService: DepartmentsService,
    private salService: SalarysService,
    private atdService: AttendanceService
  ) {}

  data: any[] = [];
  options: any[] = [];

  empLabels: any = [];
  depLabels: any = [];
  salLabels: any = [];
  atdLabels: any = [];

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
    'January',
    'February',
    'March',
    'April',
  ];
  datasets: any = [
    [
      {
        label: 'Employee',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-primary'),
        pointHoverBorderColor: getStyle('--cui-primary'),
        // data: [65, 59, 84, 84, 51, 55, 40]
        data: []
      },
    ],
    [
      {
        label: 'Department',
        backgroundColor: 'transparent',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-info'),
        pointHoverBorderColor: getStyle('--cui-info'),
        // data: [1, 18, 9, 17, 34, 22, 11]
        data: [],
      },
    ],
    [
      {
        label: 'Salary',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        pointBackgroundColor: getStyle('--cui-warning'),
        pointHoverBorderColor: getStyle('--cui-warning'),
        // data: [78, 81, 80, 45, 34, 12, 40],
        data: [],
        fill: true,
      },
    ],
    [
      {
        label: 'Attendance',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        // data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
        data: [],
        barPercentage: 0.7,
      },
    ],
  ];
  optionsDefault = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 10,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  };

  ngOnInit(): void {
    this.getAllData();
    setTimeout(() => {
      this.setData();
      
    }, 300)
  }

  getAllData() {
    this.empService.getAll().subscribe((res) => {
      this.empTotal = res.length;

      let gr = res.reduce((acc: any, curr) => {
        const hireDate = new Date(curr.hireDate).toISOString().split('T')[0];
        
        if (acc[hireDate]) {
          acc[hireDate] += 1;
        } else {
          acc[hireDate] = 1;
        } 
        return acc;
      }, {});

      

      forEach(gr, (value: number, key) => {
        this.empLabels.push(key);
        this.datasets[0][0].data.push(value);
      })

      

      // this.datasets[0][0].data = res.map((item) => );
    });
    this.depService.getAll().subscribe((res) => {
      this.depTotal = res.length;

      let gr = res.reduce((acc: any, curr) => {
        const id = curr.departmentId;
        if (acc[id]) {
        } else {
          this.depLabels.push(curr.departmentName)
          acc[id] = curr.employeeList?.length;
        }
        return acc;
      }, {});

      forEach(gr, (value: number, key) => {
        this.datasets[1][0].data.push(value);
      })

      
    });
    this.salService.getAll().subscribe((res) => {
      this.salTotal = res.length;
      
    });
    this.atdService.getAll().subscribe((res) => {
      this.atdTotal = res.length;

      let gr = res.reduce((acc: any, curr) => {
        const id = curr.employee.id;
        if (acc[id]) {
          acc[id] += 1;
        } else {
          acc[id] = 1;
        }
        return acc;
      }, {});

      forEach(gr, (value: number, key) => {
        let e: any = res.find((item) => `${item.employee.id}` == key)?.employee
        this.atdLabels.push(e.firstName + ' ' + e.lastName);
        this.datasets[3][0].data.push(value);
      })


    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setData() {
    for (let idx = 0; idx < 4; idx++) {
      
      this.data[idx] = {
        labels: idx == 0 ? this.empLabels : idx == 1 ? this.depLabels : idx == 2 ? this.salLabels : idx == 3 ? this.atdLabels : this.labels,
        datasets: this.datasets[idx],
      };

      
    }
    this.setOptions();
  }

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -5;
          options.scales.y.max = 10;
          options.elements.line.tension = 0;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = {
            display: false,
            drawTicks: false,
            drawBorder: false,
          };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
}

@Component({
  selector: 'app-chart-sample',
  template:
    '<c-chart type="line" [data]="data" [options]="options" width="300" #chart></c-chart>',
  standalone: true,
  imports: [ChartjsComponent],
})
export class ChartSample implements AfterViewInit {
  constructor() {}

  @ViewChild('chart') chartComponent!: ChartjsComponent;

  colors = {
    label: 'My dataset',
    backgroundColor: 'rgba(77,189,116,.2)',
    borderColor: '#4dbd74',
    pointHoverBackgroundColor: '#fff',
  };

  labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  data = {
    labels: this.labels,
    datasets: [
      {
        data: [65, 59, 84, 84, 51, 55, 40],
        ...this.colors,
        fill: { value: 65 },
      },
    ],
  };

  options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   const data = () => {
    //     return {
    //       ...this.data,
    //       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    //       datasets: [
    //         {
    //           ...this.data.datasets[0],
    //           data: [42, 88, 42, 66, 77],
    //           fill: { value: 55 },
    //         },
    //         {
    //           ...this.data.datasets[0],
    //           borderColor: '#ffbd47',
    //           data: [88, 42, 66, 77, 42],
    //         },
    //       ],
    //     };
    //   };
    //   const newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    //   const newData = [42, 88, 42, 66, 77];
    //   let { datasets, labels } = { ...this.data };
    //   // @ts-ignore
    //   const before = this.chartComponent?.chart?.data.datasets.length;
    //   console.log('before', before);
    //   // console.log('datasets, labels', datasets, labels)
    //   // @ts-ignore
    //   // this.data = data()
    //   this.data = {
    //     ...this.data,
    //     datasets: [
    //       { ...this.data.datasets[0], data: newData },
    //       {
    //         ...this.data.datasets[0],
    //         borderColor: '#ffbd47',
    //         data: [88, 42, 66, 77, 42],
    //       },
    //     ],
    //     labels: newLabels,
    //   };
    //   // console.log('datasets, labels', { datasets, labels } = {...this.data})
    //   // @ts-ignore
    //   setTimeout(() => {
    //     const after = this.chartComponent?.chart?.data.datasets.length;
    //     console.log('after', after);
    //   });
    // }, 5000);
  }
}
