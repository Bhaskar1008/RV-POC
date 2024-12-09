<template>
  <div class="dashboard">
    <header>
      <h1>Hello John, welcome back!</h1>
      <p>Last logged in: <span>24th Oct 2021</span></p>
    </header>

    <section class="filters">
      <label for="product">Dashboard of:</label>
      <select id="product" v-model="selectedProduct">
        <option v-for="product in products" :key="product.code" :value="product.code">
          {{ product.name }}
        </option>
      </select>
    </section>

    <section class="metrics">
      <div class="metric" v-for="metric in metrics" :key="metric.label">
        <h2>{{ metric.value }}</h2>
        <p>{{ metric.label }}</p>
        <span :class="{'up': metric.trend === 'up', 'down': metric.trend === 'down'}">{{ metric.trend === 'up' ? '↑' : '↓' }}</span>
      </div>
    </section>

    <section class="coverage-report">
      <h3>Top 5 Covers Taken</h3>
      <table>
        <thead>
          <tr>
            <th>Coverage Name</th>
            <th>No. of Renewals</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coverage in coverages" :key="coverage.name">
            <td>{{ coverage.name }}</td>
            <td>{{ coverage.value }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="pie-chart">
      <h3>Coverage Wise Report</h3>
      <canvas id="coveragePieChart"></canvas>
    </section>

    <section class="batch-list">
      <h3>Collection & Processing Batch Lists</h3>
      <table>
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Job Scheduled Date/Time</th>
            <th>Status</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="batch in batches" :key="batch.id">
            <td>{{ batch.id }}</td>
            <td>{{ batch.scheduled }}</td>
            <td>{{ batch.status }}</td>
            <td>
              <button v-if="batch.status !== 'Processing'" @click="exportBatch(batch.id)">Export to Excel</button>
              <span v-else>Processing...</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="lob-renewal">
      <h3>LOB-wise Renewal Activity</h3>
      <div class="chart-controls">
        <label for="dateRange">Date Range:</label>
        <select id="dateRange" v-model="selectedDateRange" @change="updateChartData">
          <option v-for="range in dateRanges" :key="range" :value="range">{{ range }}</option>
        </select>
        <button @click="exportChartData">Export</button>
      </div>
      <canvas id="lobBarChart"></canvas>
    </section>
  </div>
</template>

<script>
import { Chart } from 'chart.js';

export default {
  data() {
    return {
      selectedProduct: 'MOTOR',
      products: [
        { name: 'Travel', code: 'TRAVEL' },
        { name: 'Bharat Griha Raksha', code: 'BGR' },
        { name: 'Motor', code: 'MOTOR' },
        { name: 'Personal Accident', code: 'PA' },
        { name: 'GCV', code: 'GCV' },
        { name: 'PCV', code: 'PCV' }
      ],
      metrics: [
        { label: 'Total No of Policies to be renewed', value: '100K', trend: 'down' },
        { label: 'Endorsement Requests Processed', value: '40K', trend: 'down' },
        { label: 'No of Policies Renewed Successfully', value: '90K', trend: 'up' },
        { label: 'Renewals Rejected', value: '1.5K', trend: 'down' }
      ],
      coverages: [
        { name: 'Personal Accident', value: '73.1K' },
        { name: 'Third Party', value: '73.1K' },
        { name: 'Accidental Coverage', value: '73.1K' },
        { name: 'Theft', value: '73.1K' },
        { name: 'Fire', value: '73.1K' }
      ],
      batches: [
        { id: '9283910383', scheduled: '2022-01-01 12:55:15PM', status: 'Scheduled' },
        { id: '9283910384', scheduled: '2022-01-01 12:55:15PM', status: 'In-Progress' },
        { id: '9283910385', scheduled: '2022-01-01 12:55:15PM', status: 'In-Progress' },
        { id: '9283910386', scheduled: '2022-01-01 12:55:15PM', status: 'Scheduled' }
      ],
      dateRanges: ['Q1 - FY2021', 'Q2 - FY2021', 'Q3 - FY2021', 'Q4 - FY2021'],
      selectedDateRange: 'Q1 - FY2021',
      lobChart: null
    };
  },
  methods: {
    exportBatch(batchId) {
      alert(`Exporting batch: ${batchId}`);
    },
    updateChartData() {
      this.lobChart.data.datasets[0].data = this.generateRandomData();
      this.lobChart.update();
    },
    exportChartData() {
      alert('Exporting LOB Renewal Activity chart data');
    },
    generateRandomData() {
      return Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1);
    }
  },
  mounted() {
    const ctx = document.getElementById('lobBarChart').getContext('2d');
    this.lobChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Motor Commercial GCV', 'Motor Commercial MCV', 'Motor Commercial PCV', 'Medicare - All Variant', 'Travel Guard with Sub-limit'],
        datasets: [
          {
            label: 'Renewals',
            data: this.generateRandomData(),
            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#9C27B0']
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'LOB-wise Renewal Activity'
          }
        }
      }
    });
  }
};
</script>

<style>
.dashboard {
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

.filters {
  margin-bottom: 20px;
}

.metrics {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.metric {
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
  flex: 1;
}

.coverage-report,
.pie-chart,
.batch-list,
.lob-renewal {
  margin-bottom: 20px;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.lob-renewal canvas {
  max-width: 100%;
}

.up {
  color: green;
}

.down {
  color: red;
}
</style>
