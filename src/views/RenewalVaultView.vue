<template>
  <div class="dashboard">
    <header>
      <h1>Hello John, welcome back!</h1>
      <p>Last logged in: <strong>24th Oct 2021</strong></p>
    </header>

    <section class="dashboard-header">
      <h2>Dashboard of <span>{{ selectedProduct.name }}</span></h2>
      <select v-model="selectedProduct" @change="updateDashboard">
        <option v-for="product in products" :key="product.code" :value="product">
          {{ product.name }}
        </option>
      </select>
    </section>

    <section class="metrics">
      <div class="metric-card" v-for="metric in metrics" :key="metric.label">
        <h3>{{ metric.count }}K</h3>
        <p>{{ metric.label }}</p>
        <span :class="{ up: metric.trend === 'up', down: metric.trend === 'down' }">
          {{ metric.trend === 'up' ? '↑' : '↓' }}
        </span>
      </div>
    </section>

    <section class="coverage-report">
      <div>
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
              <td>{{ coverage.renewals }}K</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3>Coverage Wise Report</h3>
        <canvas id="coverageChart"></canvas>
      </div>
    </section>

    <section class="batch-lists">
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
          <tr v-for="batch in batchList" :key="batch.id">
            <td>{{ batch.id }}</td>
            <td>{{ batch.scheduled }}</td>
            <td>{{ batch.status }}</td>
            <td><button @click="exportToExcel(batch.id)">Export to Excel</button></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'Dashboard',
  setup() {
    const products = ref([
      { name: 'Travel', code: 'TRAVEL' },
      { name: 'Bharat Griha Raksha', code: 'BGR' },
      { name: 'Motor', code: 'MOTOR' },
      { name: 'Personal Accident', code: 'PA' },
      { name: 'GCV', code: 'GCV' },
      { name: 'PCV', code: 'PCV' },
    ]);

    const selectedProduct = ref(products.value[0]);
    const metrics = ref([]);
    const coverages = ref([]);
    const batchList = ref([]);

    const generateRandomData = () => {
      metrics.value = [
        { label: 'Total No. of Policies to be Renewed', count: Math.floor(Math.random() * 100) + 1, trend: 'up' },
        { label: 'Endorsement Requests Processed', count: Math.floor(Math.random() * 50) + 1, trend: 'down' },
        { label: 'No. of Policies Renewed Successfully', count: Math.floor(Math.random() * 90) + 1, trend: 'up' },
        { label: 'Renewals Rejected', count: Math.floor(Math.random() * 20) + 1, trend: 'down' },
      ];

      coverages.value = Array.from({ length: 5 }, (_, i) => ({
        name: `Coverage ${i + 1}`,
        renewals: Math.floor(Math.random() * 80) + 1,
      }));

      batchList.value = Array.from({ length: 4 }, (_, i) => ({
        id: `92839103${i + 1}`,
        scheduled: `2022-01-01 12:${55 + i}:15PM`,
        status: i % 2 === 0 ? 'SCHEDULED' : 'IN-PROGRESS',
      }));
    };

    const updateDashboard = () => {
      generateRandomData();
      renderChart();
    };

    const renderChart = () => {
      const ctx = document.getElementById('coverageChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: coverages.value.map(c => c.name),
          datasets: [
            {
              data: coverages.value.map(c => c.renewals),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
          ],
        },
      });
    };

    const exportToExcel = (batchId) => {
      alert(`Exporting batch ${batchId} to Excel...`);
    };

    onMounted(() => {
      generateRandomData();
      renderChart();
    });

    return {
      products,
      selectedProduct,
      metrics,
      coverages,
      batchList,
      updateDashboard,
      exportToExcel,
    };
  },
};
</script>

<style>
.dashboard {
  font-family: Arial, sans-serif;
  margin: 20px;
}

header {
  margin-bottom: 20px;
}

.metrics {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
  text-align: center;
}

.coverage-report {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.coverage-report table {
  width: 100%;
  border-collapse: collapse;
}

.coverage-report th, .coverage-report td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.batch-lists table {
  width: 100%;
  border-collapse: collapse;
}

.batch-lists th, .batch-lists td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}
</style>
