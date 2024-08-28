import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { StatisticsService } from '../../shared/services/statistics.service';
import { LoadingService } from '../../shared/services/loading.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  timeRange: 'week' | 'month' = 'week';

  categories = [
    'WORK', 'PERSONAL', 'FAMILY', 'HEALTH', 'EDUCATION',
    'FINANCE', 'SOCIAL', 'TRAVEL', 'ENTERTAINMENT', 'SPORTS',
    'MEETING', 'HOLIDAY', 'APPOINTMENT', 'REMINDER', 'SHOPPING', 'OTHER'
  ];

  chartColors = [
    '#7395c5',
    '#36A2EB',
    '#A680B8',
    '#FF9F40',
    '#97D077',
    '#966738',
    '#EA6B66',
    '#E64735',
    '#E3AD42',
    '#FFCE56',
    '#B5739D',
    '#0F996B',
    '#4BC0C0',
    '#009999',
    '#ee5985',
    '#607D8B'
  ];

  taskCounts: number[] = [];
  chart: Chart | undefined;
  totalTasks: number = 0;
  topCategories: {name: string, count: number, color: string}[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private statisticsService: StatisticsService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  fetchData() {
    this.loadingService.setLoading(true);
    const userId = localStorage.getItem('userId');
    if (userId) {
      const observable = this.timeRange === 'week'
        ? this.statisticsService.getCurrentWeekEvents(userId)
        : this.statisticsService.getCurrentMonthEvents(userId);

      observable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          this.processData(data);
          this.updateChart();
        },
        error: (error) => {
          console.error(`Error fetching ${this.timeRange}ly data:`, error);
          // Handle error (e.g., show error message to user)
        },
        complete: () => {
          this.loadingService.setLoading(false);
        }
      });
    } else {
      console.error('User ID is null or undefined');
      this.loadingService.setLoading(false);
    }
  }

  processData(data: Record<string, number>) {
    this.taskCounts = this.categories.map(category => data[category] || 0);
    this.calculateStatistics();
  }

  calculateStatistics() {
    this.totalTasks = this.taskCounts.reduce((a, b) => a + b, 0);
    this.topCategories = this.categories.map((cat, index) => ({
      name: cat,
      count: this.taskCounts[index],
      color: this.chartColors[index]
    })).sort((a, b) => b.count - a.count).slice(0, 5);
  }

  createChart() {
    const ctx = this.chartCanvas?.nativeElement.getContext('2d');
    if (ctx) {
      const chartData: ChartData<'doughnut', number[], string> = {
        labels: this.categories,
        datasets: [{
          data: this.taskCounts,
          backgroundColor: this.chartColors,
          borderWidth: 0
        }]
      };

      const chartConfig: ChartConfiguration<'doughnut', number[], string> = {
        type: 'doughnut',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed;
                  const percentage = ((value / this.totalTasks) * 100).toFixed(1);
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '70%',
          layout: {
            padding: 10
          }
        }
      };

      this.chart = new Chart(ctx, chartConfig as any);
    }
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.taskCounts;
      this.chart.update();
    } else if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  setTimeRange(range: 'week' | 'month') {
    this.timeRange = range;
    this.fetchData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
