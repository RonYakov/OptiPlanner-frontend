import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  categories = [
    'Work', 'Personal', 'Family', 'Health', 'Education',
    'Finance', 'Social', 'Travel', 'Entertainment', 'Sports',
    'Meeting', 'Holiday', 'Appointment', 'Reminder', 'Shopping', 'Other'
  ];

  chartColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384',
    '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
  ];

  taskCounts: number[] = [];
  chart: Chart | undefined;
  totalTasks: number = 0;
  topCategories: {name: string, count: number, color: string}[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.generateData();
    this.calculateStatistics();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.createChart();
    }
  }

  generateData() {
    this.taskCounts = this.categories.map(() => Math.floor(Math.random() * 50) + 1);
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
            padding: 10 // This adds some padding around the chart
          }
        }
      };

      this.chart = new Chart(ctx, chartConfig as any);
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
