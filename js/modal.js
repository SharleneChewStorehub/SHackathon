/**
 * Modal Manager - Handles justification modal with data visualizations
 * Phase 1C: Interactive Features & Modal
 */

class ModalManager {
    constructor() {
        this.modal = document.getElementById('modal-overlay');
        this.modalContainer = document.getElementById('modal-container');
        this.modalTitle = document.getElementById('modal-title');
        this.modalContent = document.getElementById('modal-content');
        this.modalClose = document.getElementById('modal-close');
        this.downloadBtn = document.getElementById('download-csv');
        this.launchBtn = document.getElementById('modal-launch-campaign');
        
        this.currentOpportunity = null;
        this.charts = {}; // Store chart instances for cleanup
        
        this.init();
    }

    init() {
        // Close modal events
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // Button events
        this.downloadBtn.addEventListener('click', () => this.downloadCSV());
        this.launchBtn.addEventListener('click', () => this.launchCampaign());
    }

    openModal(opportunity) {
        this.currentOpportunity = opportunity;
        this.modalTitle.textContent = `${opportunity.headline} - Analysis`;
        
        // Generate modal content
        this.generateModalContent(opportunity);
        
        // Show modal with animation
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Create charts after modal is visible
        setTimeout(() => {
            this.createCharts(opportunity);
        }, 100);
    }

    closeModal() {
        // Cleanup charts
        this.destroyCharts();
        
        // Hide modal
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear current opportunity
        this.currentOpportunity = null;
    }

    generateModalContent(opportunity) {
        const content = `
            <div class="modal-narrative">
                <h4><i class="fas fa-lightbulb"></i> Why This Opportunity Matters</h4>
                <p>${this.getNarrativeText(opportunity)}</p>
            </div>
            
            <div class="modal-sections">
                <div class="modal-section">
                    <h5><i class="fas fa-chart-line"></i> Key Insights</h5>
                    <div class="chart-container">
                        <canvas id="insight-chart"></canvas>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h5><i class="fas fa-database"></i> Supporting Data</h5>
                    <div class="data-grid" id="data-grid">
                        ${this.generateDataGrid(opportunity)}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h5><i class="fas fa-target"></i> Expected Impact</h5>
                    <div class="chart-container">
                        <canvas id="impact-chart"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        this.modalContent.innerHTML = content;
    }

    getNarrativeText(opportunity) {
        const narratives = {
            'win-back-vips': `Your VIP customers (spending >RM500 lifetime) represent 15% of your customer base but generate 45% of your revenue. Our analysis shows 8 VIP customers haven't visited in 14+ days, with an average historical spend of RM400 per customer. A targeted win-back campaign could recover RM3,200 in potential revenue.`,
            
            'boost-karipap': `Karipap Pusing has a 65% profit margin (RM2.60 profit per RM4.00 item) but represents only 8% of your total sales volume. Customer data shows 78% of customers who try it become repeat buyers. A strategic promotion could increase sales by 40%, generating an additional RM1,800 in profit.`,
            
            'combo-deals': `Analysis of 2,847 transactions shows customers who order Nasi Lemak (your top seller) have a 34% likelihood of also purchasing a drink within the same visit. However, only 23% currently do. A combo deal could increase your average order value by RM3.50 per transaction, generating RM2,100 additional monthly revenue.`
        };
        
        return narratives[opportunity.id] || 'This opportunity is based on comprehensive analysis of your business data and customer behavior patterns.';
    }

    generateDataGrid(opportunity) {
        const dataPoints = this.getDataPoints(opportunity);
        return dataPoints.map(point => `
            <div class="data-item">
                <div class="data-item-label">${point.label}</div>
                <div class="data-item-value ${point.trend || ''}">${point.value}</div>
            </div>
        `).join('');
    }

    getDataPoints(opportunity) {
        const dataMap = {
            'win-back-vips': [
                { label: 'VIP Customers At Risk', value: '8 customers', trend: 'negative' },
                { label: 'Average VIP Spend', value: 'RM 400', trend: 'positive' },
                { label: 'Days Since Last Visit', value: '18 days', trend: 'negative' },
                { label: 'Historical Win-Back Rate', value: '67%', trend: 'positive' },
                { label: 'Potential Revenue Recovery', value: 'RM 3,200', trend: 'positive' },
                { label: 'Campaign Cost Estimate', value: 'RM 120', trend: 'neutral' }
            ],
            
            'boost-karipap': [
                { label: 'Current Sales Volume', value: '45 units/week', trend: 'neutral' },
                { label: 'Profit Margin', value: '65%', trend: 'positive' },
                { label: 'Repeat Purchase Rate', value: '78%', trend: 'positive' },
                { label: 'Market Potential', value: '+40% sales', trend: 'positive' },
                { label: 'Profit per Unit', value: 'RM 2.60', trend: 'positive' },
                { label: 'Promotion Investment', value: 'RM 200', trend: 'neutral' }
            ],
            
            'combo-deals': [
                { label: 'Nasi Lemak Orders', value: '234/week', trend: 'positive' },
                { label: 'Current Drink Attachment', value: '23%', trend: 'negative' },
                { label: 'Optimal Attachment Rate', value: '34%', trend: 'positive' },
                { label: 'Average Order Increase', value: 'RM 3.50', trend: 'positive' },
                { label: 'Weekly Revenue Potential', value: 'RM 525', trend: 'positive' },
                { label: 'Implementation Cost', value: 'RM 50', trend: 'neutral' }
            ]
        };
        
        return dataMap[opportunity.id] || [];
    }

    createCharts(opportunity) {
        this.createInsightChart(opportunity);
        this.createImpactChart(opportunity);
    }

    createInsightChart(opportunity) {
        const ctx = document.getElementById('insight-chart');
        if (!ctx) return;
        
        const chartData = this.getInsightChartData(opportunity);
        
        this.charts.insight = new Chart(ctx, {
            type: chartData.type,
            data: chartData.data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: chartData.title,
                        color: '#FFFFFF',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#FFFFFF' }
                    }
                },
                scales: chartData.scales || {}
            }
        });
    }

    createImpactChart(opportunity) {
        const ctx = document.getElementById('impact-chart');
        if (!ctx) return;
        
        const chartData = this.getImpactChartData(opportunity);
        
        this.charts.impact = new Chart(ctx, {
            type: chartData.type,
            data: chartData.data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: chartData.title,
                        color: '#FFFFFF',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#FFFFFF' }
                    }
                },
                scales: chartData.scales || {}
            }
        });
    }

    getInsightChartData(opportunity) {
        const chartMap = {
            'win-back-vips': {
                type: 'doughnut',
                title: 'VIP Customer Status Distribution',
                data: {
                    labels: ['Active VIPs', 'At-Risk VIPs', 'Lost VIPs'],
                    datasets: [{
                        data: [42, 8, 3],
                        backgroundColor: ['#10B981', '#FF6B35', '#EF4444'],
                        borderWidth: 0
                    }]
                }
            },
            
            'boost-karipap': {
                type: 'bar',
                title: 'Product Performance vs Potential',
                data: {
                    labels: ['Current Sales', 'Potential Sales', 'Profit Margin'],
                    datasets: [{
                        label: 'Performance Metrics',
                        data: [45, 63, 65],
                        backgroundColor: ['#6B7280', '#FF6B35', '#10B981'],
                        borderWidth: 0
                    }]
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#FFFFFF' }
                    },
                    x: {
                        ticks: { color: '#FFFFFF' }
                    }
                }
            },
            
            'combo-deals': {
                type: 'bar',
                title: 'Order Attachment Analysis',
                data: {
                    labels: ['Current Rate', 'Optimal Rate', 'Improvement'],
                    datasets: [{
                        label: 'Attachment Rates (%)',
                        data: [23, 34, 11],
                        backgroundColor: ['#EF4444', '#10B981', '#FF6B35'],
                        borderWidth: 0
                    }]
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#FFFFFF' }
                    },
                    x: {
                        ticks: { color: '#FFFFFF' }
                    }
                }
            }
        };
        
        return chartMap[opportunity.id] || chartMap['win-back-vips'];
    }

    getImpactChartData(opportunity) {
        const chartMap = {
            'win-back-vips': {
                type: 'line',
                title: 'Revenue Recovery Projection',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Projected Revenue',
                        data: [800, 1600, 2400, 3200],
                        borderColor: '#FF6B35',
                        backgroundColor: 'rgba(255, 107, 53, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: '#FFFFFF',
                            callback: function(value) {
                                return 'RM ' + value;
                            }
                        }
                    },
                    x: {
                        ticks: { color: '#FFFFFF' }
                    }
                }
            },
            
            'boost-karipap': {
                type: 'line',
                title: 'Profit Growth Projection',
                data: {
                    labels: ['Current', 'Month 1', 'Month 2', 'Month 3'],
                    datasets: [{
                        label: 'Monthly Profit',
                        data: [468, 650, 850, 1200],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: '#FFFFFF',
                            callback: function(value) {
                                return 'RM ' + value;
                            }
                        }
                    },
                    x: {
                        ticks: { color: '#FFFFFF' }
                    }
                }
            },
            
            'combo-deals': {
                type: 'bar',
                title: 'Revenue Impact Comparison',
                data: {
                    labels: ['Before Combo', 'After Combo', 'Net Increase'],
                    datasets: [{
                        label: 'Monthly Revenue',
                        data: [8190, 10290, 2100],
                        backgroundColor: ['#6B7280', '#10B981', '#FF6B35'],
                        borderWidth: 0
                    }]
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: '#FFFFFF',
                            callback: function(value) {
                                return 'RM ' + value;
                            }
                        }
                    },
                    x: {
                        ticks: { color: '#FFFFFF' }
                    }
                }
            }
        };
        
        return chartMap[opportunity.id] || chartMap['win-back-vips'];
    }

    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }

    downloadCSV() {
        if (!this.currentOpportunity) return;
        
        const csvData = this.generateCSVData(this.currentOpportunity);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentOpportunity.id}-analysis-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Show success notification
        this.showNotification('CSV downloaded successfully!', 'success');
    }

    generateCSVData(opportunity) {
        const headers = ['Metric', 'Value', 'Trend', 'Impact'];
        const dataPoints = this.getDataPoints(opportunity);
        
        let csv = headers.join(',') + '\n';
        
        dataPoints.forEach(point => {
            const row = [
                `"${point.label}"`,
                `"${point.value}"`,
                `"${point.trend || 'neutral'}"`,
                `"${opportunity.impact}"`
            ];
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }

    launchCampaign() {
        if (!this.currentOpportunity) return;
        
        // Close modal first
        this.closeModal();
        
        // Trigger campaign launch (this will be handled by the main dashboard)
        const event = new CustomEvent('launchCampaign', {
            detail: { opportunity: this.currentOpportunity }
        });
        document.dispatchEvent(event);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
}); 