/**
 * Modal Manager - Handles justification modal with data visualizations
 * Phase 1C: Interactive Features & Modal
 */

// Register Chart.js datalabels plugin
Chart.register(ChartDataLabels);

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
        this.downloadBtn.addEventListener('click', () => this.toggleCSVDropdown());
        
        // CSV dropdown events
        this.csvDropdown = document.getElementById('csv-dropdown');
        this.csvDropdownArrow = document.querySelector('.csv-dropdown-arrow');
        
        // CSV option events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.csv-option')) {
                const option = e.target.closest('.csv-option');
                const type = option.dataset.type;
                this.downloadCSV(type);
                this.hideCSVDropdown();
            } else if (!e.target.closest('.csv-download-container')) {
                this.hideCSVDropdown();
            }
        });
        if (this.launchBtn) {
            this.launchBtn.addEventListener('click', () => this.launchCampaign());
        } else {
            console.error('Modal launch button not found');
        }
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
                
                ${opportunity.id === 'boost-karipap' ? this.generateComparisonMatrix(opportunity) : ''}
                
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
                        color: '#000000',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        labels: { 
                            color: '#000000',
                            font: { size: 12 }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: '#FFFFFF',
                        font: { size: 12, weight: 'bold' },
                        formatter: (value, context) => {
                            if (chartData.type === 'doughnut') {
                                return value;
                            } else if (chartData.type === 'bar') {
                                const labels = context.chart.data.labels[context.dataIndex];
                                if (labels && labels.includes('%')) {
                                    return value + '%';
                                }
                                return value;
                            }
                            return value;
                        }
                    }
                },
                scales: chartData.scales || {},
                elements: {
                    bar: {
                        borderWidth: 0
                    }
                }
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
                        color: '#000000',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        labels: { 
                            color: '#000000',
                            font: { size: 12 }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: '#FFFFFF',
                        font: { size: 12, weight: 'bold' },
                        formatter: (value, context) => {
                            if (chartData.type === 'line') {
                                return 'RM ' + value;
                            } else if (chartData.type === 'bar') {
                                return 'RM ' + value;
                            }
                            return value;
                        }
                    }
                },
                scales: chartData.scales || {},
                elements: {
                    bar: {
                        borderWidth: 0
                    }
                }
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
                    labels: ['Current Sales', 'Potential Sales', 'Profit Margin %'],
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
                        ticks: { 
                            color: '#000000',
                            font: { size: 11 }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
                    },
                    x: {
                        ticks: { 
                            color: '#000000',
                            font: { size: 11 }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
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
                        ticks: { 
                            color: '#000000',
                            font: { size: 11 },
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
                    },
                    x: {
                        ticks: { 
                            color: '#000000',
                            font: { size: 11 }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
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
                            color: '#000000',
                            font: { size: 11 },
                            callback: function(value) {
                                return 'RM ' + value;
                            }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
                    },
                    x: {
                        ticks: { 
                            color: '#000000',
                            font: { size: 11 }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
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
                            color: '#000000',
                            font: { size: 11 },
                            callback: function(value) {
                                return 'RM ' + value;
                            }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
                    },
                    x: {
                        ticks: { 
                            color: '#000000',
                            font: { size: 11 }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
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
                            color: '#000000',
                            font: { size: 11 },
                            callback: function(value) {
                                return 'RM ' + value;
                            }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
                    },
                    x: {
                        ticks: { 
                            color: '#000000',
                            font: { size: 11 }
                        },
                        grid: {
                            color: '#E5E5E5'
                        }
                    }
                }
            }
        };
        
        return chartMap[opportunity.id] || chartMap['win-back-vips'];
    }

    generateComparisonMatrix(opportunity) {
        return `
            <div class="modal-section">
                <h5><i class="fas fa-th"></i> Product Portfolio Analysis</h5>
                <div class="comparison-matrix">
                    <div class="matrix-container">
                        <div class="matrix-header">
                            <div class="matrix-title">Profit Margin vs Sales Volume</div>
                            <div class="matrix-subtitle">Position your products in the market landscape</div>
                        </div>
                        
                        <div class="matrix-grid">
                            <div class="matrix-labels">
                                <div class="y-axis-label">
                                    <span class="axis-title">Profit Margin</span>
                                    <div class="axis-values">
                                        <span>High</span>
                                        <span>Low</span>
                                    </div>
                                </div>
                                <div class="x-axis-label">
                                    <span class="axis-title">Sales Volume</span>
                                    <div class="axis-values">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="matrix-quadrants">
                                <div class="quadrant high-profit-low-sales">
                                    <div class="quadrant-label">High Profit<br>Low Sales</div>
                                    <div class="product-item highlighted">
                                        <div class="product-name">Karipap Pusing</div>
                                        <div class="product-stats">65% margin, 45 units/week</div>
                                        <div class="opportunity-tag">OPPORTUNITY</div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-name">Curry Puff</div>
                                        <div class="product-stats">58% margin, 32 units/week</div>
                                    </div>
                                </div>
                                
                                <div class="quadrant high-profit-high-sales">
                                    <div class="quadrant-label">High Profit<br>High Sales</div>
                                    <div class="product-item star">
                                        <div class="product-name">Nasi Lemak</div>
                                        <div class="product-stats">52% margin, 234 units/week</div>
                                        <div class="star-tag">⭐ STAR</div>
                                    </div>
                                </div>
                                
                                <div class="quadrant low-profit-low-sales">
                                    <div class="quadrant-label">Low Profit<br>Low Sales</div>
                                    <div class="product-item">
                                        <div class="product-name">Mee Goreng</div>
                                        <div class="product-stats">28% margin, 28 units/week</div>
                                    </div>
                                </div>
                                
                                <div class="quadrant low-profit-high-sales">
                                    <div class="quadrant-label">Low Profit<br>High Sales</div>
                                    <div class="product-item">
                                        <div class="product-name">Kopi O</div>
                                        <div class="product-stats">35% margin, 156 units/week</div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-name">Teh Tarik</div>
                                        <div class="product-stats">42% margin, 89 units/week</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="matrix-insights">
                            <div class="insight-item">
                                <i class="fas fa-lightbulb"></i>
                                <span><strong>Karipap Pusing</strong> is your hidden gem - high profit but underperforming in sales. A targeted promotion could move it towards the "Star" quadrant.</span>
                            </div>
                            <div class="insight-item">
                                <i class="fas fa-target"></i>
                                <span>Focus on promoting high-margin, low-volume items to maximize profitability with minimal effort.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }

    toggleCSVDropdown() {
        if (!this.csvDropdown) return;
        
        const isActive = this.csvDropdown.classList.contains('active');
        
        if (isActive) {
            this.hideCSVDropdown();
        } else {
            this.showCSVDropdown();
        }
    }
    
    showCSVDropdown() {
        if (!this.csvDropdown) return;
        
        this.csvDropdown.classList.add('active');
        if (this.csvDropdownArrow) {
            this.csvDropdownArrow.classList.add('rotated');
        }
    }
    
    hideCSVDropdown() {
        if (!this.csvDropdown) return;
        
        this.csvDropdown.classList.remove('active');
        if (this.csvDropdownArrow) {
            this.csvDropdownArrow.classList.remove('rotated');
        }
    }

    downloadCSV(type = 'summary') {
        if (!this.currentOpportunity) return;
        
        let csvData, filename;
        
        if (type === 'actionable') {
            csvData = this.generateActionableListCSV(this.currentOpportunity);
            filename = `${this.currentOpportunity.id}-actionable-list-${new Date().toISOString().split('T')[0]}.csv`;
        } else {
            csvData = this.generateInsightSummaryCSV(this.currentOpportunity);
            filename = `${this.currentOpportunity.id}-insight-summary-${new Date().toISOString().split('T')[0]}.csv`;
        }
        
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        const downloadType = type === 'actionable' ? 'Actionable List' : 'Insight Summary';
        this.showNotification(`${downloadType} CSV downloaded successfully!`, 'success');
    }

    generateActionableListCSV(opportunity) {
        // Generate ready-to-use raw data for immediate action
        const actionableData = this.getActionableData(opportunity);
        
        let csv = actionableData.headers.join(',') + '\n';
        
        actionableData.rows.forEach(row => {
            const csvRow = row.map(cell => `"${cell}"`);
            csv += csvRow.join(',') + '\n';
        });
        
        return csv;
    }
    
    generateInsightSummaryCSV(opportunity) {
        // Generate portable business case with two worksheets
        let csv = '';
        
        // Worksheet 1: Opportunity Briefing
        csv += 'OPPORTUNITY BRIEFING\n';
        csv += 'Field,Value\n';
        csv += `"Opportunity","${opportunity.headline}"\n`;
        csv += `"Category","${opportunity.categoryLabel}"\n`;
        csv += `"Summary","${opportunity.summary}"\n`;
        csv += `"Estimated Impact","${window.mockData.utils.formatCurrency(opportunity.estimatedImpact.amount)} ${opportunity.estimatedImpact.period}"\n`;
        csv += `"Confidence Level","${opportunity.estimatedImpact.confidence}%"\n`;
        csv += `"Created Date","${new Date(opportunity.createdDate).toLocaleDateString('en-MY')}"\n`;
        csv += `"Narrative","${this.getNarrativeText(opportunity)}"\n`;
        
        // Add supporting data
        const dataPoints = this.getDataPoints(opportunity);
        dataPoints.forEach(point => {
            csv += `"${point.label}","${point.value}"\n`;
        });
        
        csv += '\n\n';
        
        // Worksheet 2: Promotion Planner
        csv += 'PROMOTION PLANNER\n';
        csv += 'Field,Your Plan,Notes\n';
        csv += '"Promotion Idea","","What specific promotion will you run?"\n';
        csv += '"Offer Details","","What discount/incentive will you provide?"\n';
        csv += '"Target Audience","","Which customers will you target?"\n';
        csv += '"Campaign Duration","","How long will this promotion run?"\n';
        csv += '"Success Metrics","","How will you measure success?"\n';
        csv += '\n';
        csv += 'PROFIT CALCULATOR\n';
        csv += 'Field,Value,Formula\n';
        csv += '"Standard Price","","Enter your normal selling price"\n';
        csv += '"Proposed Discount","","Enter discount percentage or amount"\n';
        csv += '"New Price","","=Standard Price - Discount"\n';
        csv += '"Cost per Unit","","Enter your cost to make/buy this item"\n';
        csv += '"New Profit per Unit","","=New Price - Cost per Unit"\n';
        csv += '"Expected Volume Increase","","How many more units do you expect to sell?"\n';
        csv += '"Total Additional Profit","","=New Profit per Unit × Volume Increase"\n';
        
        return csv;
    }
    
    getActionableData(opportunity) {
        const actionableMap = {
            'win-back-vips': {
                headers: ['Customer Name', 'Phone Number', 'Last Visit Date', 'Lifetime Spend', 'Favorite Item', 'Avg Order Value', 'Visit Frequency'],
                rows: [
                    ['Siti Aminah', '+60123456789', '2024-12-10', 'RM890.50', 'Nasi Lemak Special', 'RM52.30', 'Weekly'],
                    ['Ahmad Faisal', '+60123456790', '2024-12-08', 'RM1,205.60', 'Karipap Pusing', 'RM43.80', 'Bi-weekly'],
                    ['Lim Wei Ming', '+60123456791', '2024-12-12', 'RM978.00', 'Mee Goreng Mamak', 'RM48.90', 'Weekly'],
                    ['Fatimah Zahra', '+60123456792', '2024-12-05', 'RM1,456.20', 'Nasi Lemak + Kopi O', 'RM67.20', 'Daily'],
                    ['Raj Kumar', '+60123456793', '2024-12-07', 'RM756.80', 'Teh Tarik + Roti Canai', 'RM35.60', 'Bi-weekly'],
                    ['Chen Li Mei', '+60123456794', '2024-12-11', 'RM1,123.40', 'Curry Laksa', 'RM58.90', 'Weekly'],
                    ['Hassan Abdullah', '+60123456795', '2024-12-06', 'RM834.70', 'Char Kway Teow', 'RM41.20', 'Weekly'],
                    ['Priya Sharma', '+60123456796', '2024-12-09', 'RM1,298.30', 'Nasi Lemak + Teh Tarik', 'RM62.80', 'Daily']
                ]
            },
            'boost-karipap': {
                headers: ['Item Name', 'Units Sold', 'Revenue', 'Cost', 'Profit', 'Margin %', 'Repeat Purchase Rate', 'Customer Rating'],
                rows: [
                    ['Karipap Pusing', '89', 'RM534.00', 'RM117.00', 'RM417.00', '78%', '78%', '4.6/5'],
                    ['Nasi Lemak', '340', 'RM2,890.00', 'RM1,590.00', 'RM1,300.00', '45%', '85%', '4.8/5'],
                    ['Kopi O', '198', 'RM1,250.00', 'RM438.00', 'RM812.00', '65%', '72%', '4.5/5'],
                    ['Mee Goreng Mamak', '156', 'RM1,248.00', 'RM598.00', 'RM650.00', '52%', '68%', '4.4/5'],
                    ['Teh Tarik', '134', 'RM756.00', 'RM242.00', 'RM514.00', '68%', '81%', '4.7/5'],
                    ['Curry Puff', '67', 'RM402.00', 'RM168.00', 'RM234.00', '58%', '65%', '4.3/5'],
                    ['Roti Canai', '89', 'RM445.00', 'RM178.00', 'RM267.00', '60%', '70%', '4.5/5'],
                    ['Char Kway Teow', '45', 'RM495.00', 'RM297.00', 'RM198.00', '40%', '62%', '4.2/5']
                ]
            },
            'combo-deals': {
                headers: ['Order ID', 'Base Item', 'Add-on Item', 'Order Value', 'Customer Type', 'Time of Day', 'Day of Week', 'Profit Margin'],
                rows: [
                    ['O001', 'Nasi Lemak', 'None', 'RM8.50', 'Regular', '12:30 PM', 'Monday', '45%'],
                    ['O002', 'Nasi Lemak', 'Kopi O', 'RM14.00', 'VIP', '1:15 PM', 'Monday', '52%'],
                    ['O003', 'Nasi Lemak', 'None', 'RM8.50', 'New', '12:45 PM', 'Monday', '45%'],
                    ['O004', 'Nasi Lemak', 'Teh Tarik', 'RM13.50', 'Regular', '1:30 PM', 'Monday', '58%'],
                    ['O005', 'Nasi Lemak', 'None', 'RM8.50', 'Regular', '2:00 PM', 'Monday', '45%'],
                    ['O006', 'Nasi Lemak', 'Kopi O', 'RM14.00', 'VIP', '2:15 PM', 'Monday', '52%'],
                    ['O007', 'Nasi Lemak', 'None', 'RM8.50', 'Regular', '12:00 PM', 'Monday', '45%'],
                    ['O008', 'Nasi Lemak', 'Teh Tarik', 'RM13.50', 'Regular', '1:45 PM', 'Monday', '58%']
                ]
            }
        };
        
        return actionableMap[opportunity.id] || actionableMap['win-back-vips'];
    }

    launchCampaign() {
        if (!this.currentOpportunity) {
            console.error('No current opportunity');
            return;
        }
        
        console.log('Modal launching campaign for opportunity:', this.currentOpportunity.id);
        
        // Close modal first
        this.closeModal();
        
        // Use the exact same method as the dashboard launch button
        if (window.dashboardManager && typeof window.dashboardManager.launchCampaign === 'function') {
            // Call the dashboard's launchCampaign method with the opportunity ID
            window.dashboardManager.launchCampaign(this.currentOpportunity.id);
        } else {
            // Retry after a short delay if dashboard manager isn't ready
            setTimeout(() => {
                if (window.dashboardManager && typeof window.dashboardManager.launchCampaign === 'function') {
                    window.dashboardManager.launchCampaign(this.currentOpportunity.id);
                } else {
                    console.error('Dashboard manager not available after retry');
                    this.showNotification('Unable to launch campaign. Please try again.', 'error');
                }
            }, 100);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info';
        if (type === 'success') icon = 'check';
        else if (type === 'error') icon = 'exclamation-triangle';
        else if (type === 'warning') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--info)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 4 seconds (longer for error messages)
        const timeout = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, timeout);
    }
}

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = new ModalManager();
}); 