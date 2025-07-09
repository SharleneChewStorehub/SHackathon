// Dashboard JavaScript - Opportunity Cards and Interactions

class DashboardManager {
    constructor() {
        this.opportunities = [];
        this.currentPage = 'dashboard';
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.loadOpportunities();
        
        // Listen for modal campaign launch events
        document.addEventListener('launchCampaign', (e) => {
            const opportunity = e.detail.opportunity;
            this.processLaunch(opportunity);
        });
    }

    setupEventListeners() {
        // Navigation event listeners
        document.addEventListener('click', (e) => {
            if (e.target.matches('.sidebar-item')) {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('href'));
            }
        });

        // Time period selector
        document.addEventListener('click', (e) => {
            if (e.target.matches('.time-period-btn')) {
                this.handleTimePeriodChange(e.target);
            }
        });

        // Info button for Growth History
        const infoButton = document.getElementById('info-button');
        if (infoButton) {
            infoButton.addEventListener('click', () => {
                this.showGrowthHistory();
            });
        }

        // Opportunity card interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.launch-btn') || e.target.closest('.launch-btn')) {
                e.preventDefault();
                const button = e.target.closest('.launch-btn');
                const opportunityId = button.getAttribute('data-opportunity-id');
                this.launchCampaign(opportunityId);
            }

            if (e.target.matches('.analysis-btn') || e.target.closest('.analysis-btn')) {
                e.preventDefault();
                const button = e.target.closest('.analysis-btn');
                const opportunityId = button.getAttribute('data-opportunity-id');
                this.showAnalysis(opportunityId);
            }
        });

        // Modal close functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal-backdrop') || e.target.matches('.modal-close')) {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    !menuToggle.contains(e.target) && 
                    sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    handleNavigation(href) {
        // Update active state
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[href="${href}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Handle page navigation
        switch (href) {
            case '#dashboard':
                this.showDashboard();
                break;
            case '#reports':
                this.showGrowthHistory();
                break;
            case '#engage':
                this.showEngagePage();
                break;
            default:
                console.log(`Navigation to ${href} not implemented yet`);
        }
    }

    showDashboard() {
        this.currentPage = 'dashboard';
        document.getElementById('main-content').innerHTML = `
            <div class="dashboard-container">
                <section class="welcome-section">
                    <h2>Welcome back, Alia!</h2>
                    <p class="welcome-subtitle">Here are your growth opportunities for today</p>
                    
                    <!-- Time Period Selector -->
                    <div class="time-period-selector">
                        <button class="time-period-btn active">Today</button>
                        <button class="time-period-btn">This Week</button>
                        <button class="time-period-btn">This Month</button>
                    </div>
                </section>

                <!-- Metrics Grid -->
                <section class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Total Sales</span>
                            <i class="fas fa-info-circle metric-info"></i>
                        </div>
                        <div class="metric-value">RM 2,890</div>
                        <div class="metric-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>(+RM 340)</span>
                        </div>
                        <a href="#" class="metric-link">Sales Report</a>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Total New Customers</span>
                            <i class="fas fa-info-circle metric-info"></i>
                        </div>
                        <div class="metric-value">23</div>
                        <div class="metric-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>(+8)</span>
                        </div>
                        <a href="#" class="metric-link">Loyalty Report</a>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Total Transactions</span>
                            <i class="fas fa-info-circle metric-info"></i>
                        </div>
                        <div class="metric-value">156</div>
                        <div class="metric-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>(+12)</span>
                        </div>
                        <a href="#" class="metric-link">Transaction Report</a>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Avg. Order Value</span>
                            <i class="fas fa-info-circle metric-info"></i>
                        </div>
                        <div class="metric-value">RM 18.50</div>
                        <div class="metric-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>(+RM 2.30)</span>
                        </div>
                        <a href="#" class="metric-link">Order Analysis</a>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-header">
                            <span class="metric-title">Avg. Items per Order</span>
                            <i class="fas fa-info-circle metric-info"></i>
                        </div>
                        <div class="metric-value">2.4</div>
                        <div class="metric-change neutral">
                            <i class="fas fa-minus"></i>
                            <span>(+0)</span>
                        </div>
                        <a href="#" class="metric-link">Item Analysis</a>
                    </div>
                </section>

                <section class="opportunities-widget" id="opportunities-widget">
                    <div class="widget-header">
                        <h3>Today's Opportunities</h3>
                        <button class="info-button" id="info-button" title="View past opportunities">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                    
                    <div class="opportunities-container" id="opportunities-container">
                        <div class="loading-state" id="loading-state">
                            <div class="spinner"></div>
                            <p>Analyzing your business data...</p>
                        </div>
                    </div>
                </section>

                <section class="dashboard-grid">
                    <div class="widget-placeholder">
                        <h4>Sales Overview</h4>
                        <p>Traditional dashboard widgets would appear here</p>
                    </div>
                    <div class="widget-placeholder">
                        <h4>Customer Insights</h4>
                        <p>Static reports and charts</p>
                    </div>
                    <div class="widget-placeholder">
                        <h4>Inventory Status</h4>
                        <p>Current stock levels</p>
                    </div>
                </section>
            </div>
        `;
        
        this.loadOpportunities();
        this.setupEventListeners();
    }

    showGrowthHistory() {
        this.currentPage = 'history';
        document.getElementById('main-content').innerHTML = `
            <div class="history-container">
                <section class="history-header">
                    <nav class="breadcrumb">
                        <a href="#dashboard">Dashboard</a>
                        <span class="breadcrumb-separator">></span>
                        <span>Growth History</span>
                    </nav>
                    <h2>Growth History</h2>
                    <p class="history-subtitle">Review your past opportunities and campaign performance</p>
                </section>

                <section class="history-content">
                    <div class="history-filters">
                        <select id="category-filter">
                            <option value="all">All Categories</option>
                            <option value="customer-lifecycle">Customer Lifecycle</option>
                            <option value="product-profitability">Product Profitability</option>
                            <option value="basket-analysis">Basket Analysis</option>
                            <option value="inventory-aging">Inventory Aging</option>
                        </select>
                        <input type="text" id="search-filter" placeholder="Search opportunities...">
                    </div>
                    
                    <div class="history-list" id="history-list">
                        ${this.renderHistoryList()}
                    </div>
                </section>
            </div>
        `;
        
        this.setupEventListeners();
    }

    showEngagePage() {
        this.currentPage = 'engage';
        document.getElementById('main-content').innerHTML = `
            <div class="engage-container">
                <section class="engage-header">
                    <h2>Engage - SMS Marketing</h2>
                    <p class="engage-subtitle">Launch targeted campaigns to grow your business</p>
                </section>

                <section class="engage-content">
                    <div class="engage-placeholder">
                        <h4>Campaign Management</h4>
                        <p>This would be the main Engage module interface</p>
                        <button class="btn btn-primary">Create New Campaign</button>
                    </div>
                </section>
            </div>
        `;
        
        this.setupEventListeners();
    }
    
    async loadOpportunities() {
        try {
            // Show loading state
            this.showLoading();
            
            // Simulate API delay for realistic loading experience
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Get opportunities from mock data
            if (window.mockData && window.mockData.currentOpportunities) {
                this.opportunities = window.mockData.currentOpportunities;
                this.renderOpportunities();
            } else {
                throw new Error('Mock data not available');
            }
            
        } catch (error) {
            console.error('Error loading opportunities:', error);
            this.showError('Failed to load opportunities. Please refresh the page.');
        }
    }
    
    showLoading() {
        if (this.loadingState) {
            this.loadingState.style.display = 'flex';
        }
    }
    
    hideLoading() {
        if (this.loadingState) {
            this.loadingState.style.display = 'none';
        }
    }
    
    showError(message) {
        this.hideLoading();
        this.opportunitiesContainer.innerHTML = `
            <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--error-color); margin-bottom: 1rem;"></i>
                <h4 style="color: var(--error-color); margin-bottom: 0.5rem;">Error Loading Opportunities</h4>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i>
                    Refresh Page
                </button>
            </div>
        `;
    }
    
    renderOpportunities() {
        this.hideLoading();
        
        if (!this.opportunities || this.opportunities.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Sort opportunities by priority
        const sortedOpportunities = [...this.opportunities].sort((a, b) => a.priority - b.priority);
        
        // Render opportunity cards
        this.opportunitiesContainer.innerHTML = sortedOpportunities
            .map(opportunity => this.createOpportunityCard(opportunity))
            .join('');
        
        // Add event listeners to cards
        this.attachCardEventListeners();
    }
    
    showEmptyState() {
        this.opportunitiesContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-lightbulb" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Opportunities Available</h4>
                <p style="color: var(--text-secondary); margin-bottom: 0;">Great job! You're all caught up with your growth opportunities.</p>
            </div>
        `;
    }
    
    createOpportunityCard(opportunity) {
        const isLaunched = opportunity.status === 'launched';
        const impactAmount = window.mockData.utils.formatCurrency(opportunity.estimatedImpact.amount);
        const impactPeriod = opportunity.estimatedImpact.period;
        
        return `
            <div class="opportunity-card ${isLaunched ? 'launched' : ''}" data-opportunity-id="${opportunity.id}">
                <div class="category-tag ${opportunity.category}">
                    <i class="fas fa-tag"></i>
                    ${opportunity.categoryLabel}
                </div>
                
                <h4 class="card-headline">${opportunity.headline}</h4>
                
                <p class="card-summary">${opportunity.summary}</p>
                
                <div class="card-impact">
                    <div class="impact-icon">
                        <i class="fas fa-arrow-trend-up"></i>
                    </div>
                    <div class="impact-content">
                        <div class="impact-text">Potential Impact:</div>
                        <div class="impact-amount">
                            ${impactAmount}
                            <span class="impact-period">/${impactPeriod}</span>
                        </div>
                    </div>
                </div>
                
                ${isLaunched ? this.createLaunchedStatus(opportunity) : this.createCardActions(opportunity)}
            </div>
        `;
    }
    
    createCardActions(opportunity) {
        return `
            <div class="card-actions">
                <button class="btn btn-secondary see-analysis-btn" data-opportunity-id="${opportunity.id}">
                    <i class="fas fa-chart-line"></i>
                    See the Analysis
                </button>
                <button class="btn btn-primary launch-campaign-btn" data-opportunity-id="${opportunity.id}">
                    <i class="fas fa-rocket"></i>
                    Launch Campaign
                </button>
            </div>
        `;
    }
    
    createLaunchedStatus(opportunity) {
        return `
            <div class="launched-status">
                <i class="fas fa-check-circle"></i>
                <span>Campaign Launched!</span>
                <a href="#" class="btn btn-sm btn-secondary" style="margin-left: auto;">
                    <i class="fas fa-chart-bar"></i>
                    View Performance
                </a>
            </div>
        `;
    }
    
    attachCardEventListeners() {
        // See Analysis buttons
        document.querySelectorAll('.see-analysis-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const opportunityId = e.target.closest('.see-analysis-btn').dataset.opportunityId;
                this.showAnalysis(opportunityId);
            });
        });
        
        // Launch Campaign buttons
        document.querySelectorAll('.launch-campaign-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const opportunityId = e.target.closest('.launch-campaign-btn').dataset.opportunityId;
                this.launchCampaign(opportunityId);
            });
        });
    }
    
    showAnalysis(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Trigger modal opening
        if (window.modalManager) {
            window.modalManager.openModal(opportunity);
        } else {
            console.error('Modal manager not available');
        }
    }
    
    launchCampaign(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Show confirmation
        if (confirm(`Are you sure you want to launch the campaign for "${opportunity.headline}"?`)) {
            this.processLaunch(opportunity);
        }
    }
    
    processLaunch(opportunity) {
        // Update opportunity status
        opportunity.status = 'launched';
        
        // Update the card UI
        this.updateCardToLaunched(opportunity);
        
        // Show success message
        this.showLaunchSuccess(opportunity);
        
        // Schedule move to history (simulate)
        setTimeout(() => {
            this.moveToHistory(opportunity);
        }, 24 * 60 * 60 * 1000); // 24 hours
    }
    
    updateCardToLaunched(opportunity) {
        const card = document.querySelector(`[data-opportunity-id="${opportunity.id}"]`);
        if (card) {
            card.classList.add('launched');
            const actionsDiv = card.querySelector('.card-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = this.createLaunchedStatus(opportunity);
            }
        }
    }
    
    showLaunchSuccess(opportunity) {
        // Create a temporary success notification
        const notification = document.createElement('div');
        notification.className = 'launch-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Campaign launched successfully!</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    moveToHistory(opportunity) {
        // Remove from current opportunities
        this.opportunities = this.opportunities.filter(opp => opp.id !== opportunity.id);
        
        // Add to history (would be handled by backend in production)
        if (window.mockData && window.mockData.historicalOpportunities) {
            window.mockData.historicalOpportunities.unshift({
                ...opportunity,
                completedDate: new Date().toISOString(),
                status: 'completed'
            });
        }
        
        // Re-render opportunities
        this.renderOpportunities();
    }
    
    renderHistoryList() {
        if (!window.mockData || !window.mockData.historicalOpportunities) {
            return '<div class="empty-state"><p>No historical opportunities available.</p></div>';
        }
        
        return window.mockData.historicalOpportunities
            .map(opportunity => `
                <div class="history-item">
                    <div class="history-item-header">
                        <span class="history-item-date">${new Date(opportunity.completedDate || opportunity.createdDate).toLocaleDateString()}</span>
                        <span class="history-item-status ${opportunity.status}">${opportunity.status}</span>
                    </div>
                    <div class="category-tag ${opportunity.category}">
                        ${opportunity.categoryLabel}
                    </div>
                    <h4 class="card-headline">${opportunity.headline}</h4>
                    <p class="card-summary">${opportunity.summary}</p>
                    <div class="card-impact">
                        <span class="impact-amount">${window.mockData.utils.formatCurrency(opportunity.estimatedImpact.amount)}</span>
                        <span class="impact-period">/${opportunity.estimatedImpact.period}</span>
                    </div>
                </div>
            `).join('');
    }
    
    closeModal() {
        const modal = document.querySelector('.modal-backdrop');
        if (modal) {
            modal.remove();
        }
    }
    
    refreshOpportunities() {
        this.loadOpportunities();
    }
    
    getOpportunityById(id) {
        return this.opportunities.find(opp => opp.id === id);
    }

    handleTimePeriodChange(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.time-period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update metrics based on selected period
        const period = button.textContent.trim();
        this.updateMetrics(period);
    }

    updateMetrics(period) {
        // Mock data for different time periods
        const metricsData = {
            'Today': {
                sales: 'RM 2,890',
                salesChange: '+RM 340',
                customers: '23',
                customersChange: '+8',
                transactions: '156',
                transactionsChange: '+12',
                avgOrder: 'RM 18.50',
                avgOrderChange: '+RM 2.30',
                avgItems: '2.4',
                avgItemsChange: '+0'
            },
            'This Week': {
                sales: 'RM 18,450',
                salesChange: '+RM 2,340',
                customers: '89',
                customersChange: '+23',
                transactions: '567',
                transactionsChange: '+89',
                avgOrder: 'RM 32.50',
                avgOrderChange: '+RM 4.20',
                avgItems: '2.8',
                avgItemsChange: '+0.3'
            },
            'This Month': {
                sales: 'RM 78,920',
                salesChange: '+RM 12,340',
                customers: '234',
                customersChange: '+67',
                transactions: '1,890',
                transactionsChange: '+234',
                avgOrder: 'RM 41.80',
                avgOrderChange: '+RM 6.50',
                avgItems: '3.2',
                avgItemsChange: '+0.5'
            }
        };

        const data = metricsData[period];
        if (data) {
            // Update metric values
            const metricCards = document.querySelectorAll('.metric-card');
            if (metricCards.length >= 5) {
                metricCards[0].querySelector('.metric-value').textContent = data.sales;
                metricCards[0].querySelector('.metric-change span').textContent = `(${data.salesChange})`;
                
                metricCards[1].querySelector('.metric-value').textContent = data.customers;
                metricCards[1].querySelector('.metric-change span').textContent = `(${data.customersChange})`;
                
                metricCards[2].querySelector('.metric-value').textContent = data.transactions;
                metricCards[2].querySelector('.metric-change span').textContent = `(${data.transactionsChange})`;
                
                metricCards[3].querySelector('.metric-value').textContent = data.avgOrder;
                metricCards[3].querySelector('.metric-change span').textContent = `(${data.avgOrderChange})`;
                
                metricCards[4].querySelector('.metric-value').textContent = data.avgItems;
                metricCards[4].querySelector('.metric-change span').textContent = `(${data.avgItemsChange})`;
            }
        }
    }
}

// Initialize dashboard when script loads
window.dashboardManager = new DashboardManager();

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
} 