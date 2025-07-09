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
                        <a href="#dashboard" class="breadcrumb-link">Dashboard</a>
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
        this.setupBreadcrumbNavigation();
    }

    showEngagePage() {
        this.currentPage = 'engage';
        document.getElementById('main-content').innerHTML = `
            <div class="engage-overview">
                <section class="engage-header">
                    <h2>Engage Overview</h2>
                    <div class="credits-display">
                        <div class="credits-card">
                            <h3>Available Credits</h3>
                            <div class="credits-count">200</div>
                            <div class="credits-breakdown">
                                <div class="credit-item">
                                    <span>Purchased</span>
                                    <span>200</span>
                                </div>
                                <div class="credit-item">
                                    <span>Free</span>
                                    <span>0</span>
                                </div>
                            </div>
                            <button class="btn btn-primary">+ Top-up</button>
                        </div>
                    </div>
                </section>

                <section class="automated-campaigns">
                    <h3>Automated Campaigns</h3>
                    <div class="campaign-categories">
                        <div class="campaign-category">
                            <h4>Welcome Message</h4>
                            <p>Reward new customers with vouchers or freebies</p>
                            <div class="campaign-option">
                                <i class="fas fa-user-plus"></i>
                                <span>Welcome New Customers</span>
                            </div>
                        </div>
                        
                        <div class="campaign-category">
                            <h4>Engage Customers</h4>
                            <p>Stay top of mind with your existing customers</p>
                            <div class="campaign-option">
                                <i class="fas fa-birthday-cake"></i>
                                <span>Birthday Promotion</span>
                            </div>
                            <div class="campaign-option">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>Cashback Reminder</span>
                            </div>
                        </div>
                        
                        <div class="campaign-category">
                            <h4>Bring Back Customers</h4>
                            <p>Remind inactive customers to return and spend again</p>
                            <div class="campaign-option">
                                <i class="fas fa-clock"></i>
                                <span>Expiring Cashback Alert</span>
                            </div>
                            <div class="campaign-option active">
                                <i class="fas fa-user-friends"></i>
                                <span>Win Back Lost Customers</span>
                            </div>
                        </div>
                        
                        <div class="campaign-category">
                            <h4>Other</h4>
                            <p>Extra tools to get ahead of the competition</p>
                            <div class="campaign-option">
                                <i class="fas fa-star"></i>
                                <span>Boost Google Reviews</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="custom-campaign">
                    <h3>Custom Campaign</h3>
                    <p>Send one-time SMS campaigns to promote your new products, limited-time offers, and special promotions.</p>
                    <div class="custom-campaign-option">
                        <i class="fas fa-sms"></i>
                        <span>One-Time SMS Campaign</span>
                    </div>
                </section>

                <section class="best-practices">
                    <h3>Best Practices for businesses like yours!</h3>
                    <p>Watch 30-second snippets of Best Practices to drive repeated sales, automatically!</p>
                </section>
            </div>
        `;
        
        this.setupEventListeners();
    }
    
    async loadOpportunities() {
        try {
            // Initialize container references
            this.opportunitiesContainer = document.getElementById('opportunities-container');
            if (!this.opportunitiesContainer) {
                console.error('Opportunities container not found');
                return;
            }
            
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
        if (this.opportunitiesContainer) {
            this.opportunitiesContainer.innerHTML = `
                <div class="loading-state" id="loading-state">
                    <div class="spinner"></div>
                    <p>Analyzing your business data...</p>
                </div>
            `;
            this.loadingState = document.getElementById('loading-state');
        }
    }
    
    hideLoading() {
        if (this.loadingState) {
            this.loadingState.style.display = 'none';
        }
    }
    
    showError(message) {
        this.hideLoading();
        if (this.opportunitiesContainer) {
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
    }
    
    renderOpportunities() {
        this.hideLoading();
        
        if (!this.opportunitiesContainer) {
            console.error('Opportunities container not found');
            return;
        }
        
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
        if (this.opportunitiesContainer) {
            this.opportunitiesContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <i class="fas fa-lightbulb" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">No Opportunities Available</h4>
                    <p style="color: var(--text-secondary); margin-bottom: 0;">Great job! You're all caught up with your growth opportunities.</p>
                </div>
            `;
        }
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
        
        // Smart routing based on campaign type
        this.routeToCampaignSetup(opportunity);
    }
    
    routeToCampaignSetup(opportunity) {
        // Update opportunity status to 'setting-up'
        opportunity.status = 'setting-up';
        this.updateCardToSettingUp(opportunity);
        
        // Route to existing Engage system based on campaign type
        switch (opportunity.campaignType) {
            case 'smart-segment':
                this.routeToAutomatedCampaign(opportunity);
                break;
            case 'one-time-custom':
                this.routeToCustomCampaign(opportunity);
                break;
            default:
                console.error('Unknown campaign type:', opportunity.campaignType);
                this.routeToCustomCampaign(opportunity);
        }
    }
    
    routeToAutomatedCampaign(opportunity) {
        // Navigate to Engage page and show automated campaign setup
        this.showEngageAutomatedCampaign(opportunity);
    }
    
    routeToCustomCampaign(opportunity) {
        // Navigate to Engage page and show custom campaign setup
        this.showEngageCustomCampaign(opportunity);
    }
    
    updateCardToSettingUp(opportunity) {
        const card = document.querySelector(`[data-opportunity-id="${opportunity.id}"]`);
        if (card) {
            card.classList.add('setting-up');
            const actionsDiv = card.querySelector('.card-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = this.createSettingUpStatus(opportunity);
            }
        }
    }
    
    createSettingUpStatus(opportunity) {
        return `
            <div class="setting-up-status">
                <i class="fas fa-cog fa-spin"></i>
                <span>Setting up campaign...</span>
                <button class="btn btn-sm btn-secondary cancel-setup-btn" data-opportunity-id="${opportunity.id}">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            </div>
        `;
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
    
    setupBreadcrumbNavigation() {
        // Handle breadcrumb navigation
        document.querySelectorAll('.breadcrumb-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.handleNavigation(href);
            });
        });
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

    showSmartSegmentCampaign(opportunity) {
        this.currentPage = 'smart-segment-campaign';
        document.getElementById('main-content').innerHTML = `
            <div class="campaign-container">
                <section class="campaign-header">
                    <nav class="breadcrumb">
                        <a href="#dashboard" class="breadcrumb-link">Dashboard</a>
                        <span class="breadcrumb-separator">></span>
                        <span>Smart Segment Campaign</span>
                    </nav>
                    <h2>AI-Powered Smart Segment</h2>
                    <p class="campaign-subtitle">Automated campaign with intelligent customer targeting</p>
                </section>

                <section class="campaign-content">
                    <div class="campaign-setup-card">
                        <div class="campaign-preview">
                            <h3><i class="fas fa-robot"></i> ${opportunity.headline}</h3>
                            <p class="campaign-description">${opportunity.summary}</p>
                            
                            <div class="smart-segment-details">
                                <h4><i class="fas fa-users"></i> Smart Segment Definition</h4>
                                <div class="segment-rule">
                                    <code>${opportunity.campaignDetails.segmentRule}</code>
                                </div>
                                <div class="segment-stats">
                                    <div class="stat">
                                        <span class="stat-label">Estimated Reach:</span>
                                        <span class="stat-value">${opportunity.campaignDetails.estimatedReach} customers</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-label">Campaign Cost:</span>
                                        <span class="stat-value">RM ${opportunity.campaignDetails.estimatedCost}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="campaign-message">
                                <h4><i class="fas fa-comment"></i> Pre-filled Message</h4>
                                <div class="message-preview">
                                    <textarea id="campaign-message" rows="4" readonly>${opportunity.campaignDetails.suggestedCopy}</textarea>
                                </div>
                            </div>
                            
                            <div class="campaign-automation">
                                <h4><i class="fas fa-magic"></i> Automation Settings</h4>
                                <div class="automation-info">
                                    <div class="automation-feature">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Automatic customer enrollment based on rules</span>
                                    </div>
                                    <div class="automation-feature">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Daily rule evaluation and updates</span>
                                    </div>
                                    <div class="automation-feature">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Performance tracking and optimization</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campaign-actions">
                            <button class="btn btn-secondary" onclick="window.dashboardManager.cancelCampaignSetup('${opportunity.id}')">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                            <button class="btn btn-primary" onclick="window.dashboardManager.confirmSmartSegmentLaunch('${opportunity.id}')">
                                <i class="fas fa-rocket"></i>
                                Launch Smart Campaign
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.setupBreadcrumbNavigation();
    }
    
    showOneTimeCampaign(opportunity) {
        this.currentPage = 'one-time-campaign';
        document.getElementById('main-content').innerHTML = `
            <div class="campaign-container">
                <section class="campaign-header">
                    <nav class="breadcrumb">
                        <a href="#dashboard" class="breadcrumb-link">Dashboard</a>
                        <span class="breadcrumb-separator">></span>
                        <span>One-Time Campaign</span>
                    </nav>
                    <h2>Tactical Promotion Campaign</h2>
                    <p class="campaign-subtitle">Strategic one-time promotion with custom targeting</p>
                </section>

                <section class="campaign-content">
                    <div class="campaign-setup-card">
                        <div class="campaign-preview">
                            <h3><i class="fas fa-bullhorn"></i> ${opportunity.headline}</h3>
                            <p class="campaign-description">${opportunity.summary}</p>
                            
                            <div class="promotion-details">
                                <h4><i class="fas fa-percentage"></i> Promotion Details</h4>
                                <div class="offer-preview">
                                    <div class="offer-box">
                                        <strong>${opportunity.campaignDetails.suggestedOffer}</strong>
                                    </div>
                                </div>
                                <div class="promotion-stats">
                                    <div class="stat">
                                        <span class="stat-label">Estimated Reach:</span>
                                        <span class="stat-value">${opportunity.campaignDetails.estimatedReach} customers</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-label">Campaign Duration:</span>
                                        <span class="stat-value">${opportunity.campaignDetails.duration || '7 days'}</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-label">Investment:</span>
                                        <span class="stat-value">RM ${opportunity.campaignDetails.estimatedCost}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="campaign-message">
                                <h4><i class="fas fa-comment"></i> Campaign Message</h4>
                                <div class="message-preview">
                                    <textarea id="campaign-message" rows="4">${opportunity.campaignDetails.suggestedCopy}</textarea>
                                    <small class="message-help">You can customize this message before launching</small>
                                </div>
                            </div>
                            
                            <div class="campaign-targeting">
                                <h4><i class="fas fa-crosshairs"></i> Targeting Strategy</h4>
                                <div class="targeting-info">
                                    <div class="targeting-method">
                                        <i class="fas fa-users"></i>
                                        <span>All active customers (last 30 days)</span>
                                    </div>
                                    <div class="targeting-method">
                                        <i class="fas fa-clock"></i>
                                        <span>Optimal send time: 11:00 AM - 2:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campaign-actions">
                            <button class="btn btn-secondary" onclick="window.dashboardManager.cancelCampaignSetup('${opportunity.id}')">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                            <button class="btn btn-primary" onclick="window.dashboardManager.confirmOneTimeLaunch('${opportunity.id}')">
                                <i class="fas fa-rocket"></i>
                                Launch Campaign
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.setupBreadcrumbNavigation();
    }
    
    showGenericCampaign(opportunity) {
        this.currentPage = 'generic-campaign';
        document.getElementById('main-content').innerHTML = `
            <div class="campaign-container">
                <section class="campaign-header">
                    <nav class="breadcrumb">
                        <a href="#dashboard" class="breadcrumb-link">Dashboard</a>
                        <span class="breadcrumb-separator">></span>
                        <span>Campaign Setup</span>
                    </nav>
                    <h2>Campaign Setup</h2>
                    <p class="campaign-subtitle">Configure your marketing campaign</p>
                </section>

                <section class="campaign-content">
                    <div class="campaign-setup-card">
                        <div class="campaign-preview">
                            <h3>${opportunity.headline}</h3>
                            <p class="campaign-description">${opportunity.summary}</p>
                            
                            <div class="generic-campaign-form">
                                <h4>Campaign Configuration</h4>
                                <p>This opportunity requires manual campaign setup. Please configure the details below.</p>
                                
                                <div class="form-group">
                                    <label for="campaign-type">Campaign Type:</label>
                                    <select id="campaign-type">
                                        <option value="sms">SMS Campaign</option>
                                        <option value="email">Email Campaign</option>
                                        <option value="push">Push Notification</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="campaign-message">Message:</label>
                                    <textarea id="campaign-message" rows="4" placeholder="Enter your campaign message..."></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campaign-actions">
                            <button class="btn btn-secondary" onclick="window.dashboardManager.cancelCampaignSetup('${opportunity.id}')">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                            <button class="btn btn-primary" onclick="window.dashboardManager.confirmGenericLaunch('${opportunity.id}')">
                                <i class="fas fa-rocket"></i>
                                Launch Campaign
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.setupBreadcrumbNavigation();
    }

    cancelCampaignSetup(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (opportunity) {
            // Reset opportunity status
            opportunity.status = 'active';
            
            // Return to dashboard
            this.showDashboard();
        }
    }
    
    confirmSmartSegmentLaunch(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Show confirmation dialog
        if (confirm(`Launch AI-powered smart segment campaign for "${opportunity.headline}"?\n\nThis will automatically target customers matching: ${opportunity.campaignDetails.segmentRule}`)) {
            this.processLaunch(opportunity);
            this.showDashboard();
        }
    }
    
    confirmOneTimeLaunch(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Get custom message if user modified it
        const messageTextarea = document.getElementById('campaign-message');
        const customMessage = messageTextarea ? messageTextarea.value : opportunity.campaignDetails.suggestedCopy;
        
        // Update campaign details with custom message
        opportunity.campaignDetails.finalMessage = customMessage;
        
        // Show confirmation dialog
        if (confirm(`Launch tactical promotion campaign for "${opportunity.headline}"?\n\nEstimated reach: ${opportunity.campaignDetails.estimatedReach} customers\nDuration: ${opportunity.campaignDetails.duration || '7 days'}`)) {
            this.processLaunch(opportunity);
            this.showDashboard();
        }
    }
    
    confirmGenericLaunch(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Get form data
        const campaignType = document.getElementById('campaign-type')?.value || 'sms';
        const message = document.getElementById('campaign-message')?.value || '';
        
        if (!message.trim()) {
            alert('Please enter a campaign message before launching.');
            return;
        }
        
        // Update campaign details
        opportunity.campaignDetails = {
            ...opportunity.campaignDetails,
            type: campaignType,
            finalMessage: message,
            estimatedReach: 100, // Default value
            estimatedCost: 50 // Default value
        };
        
        // Show confirmation dialog
        if (confirm(`Launch ${campaignType.toUpperCase()} campaign for "${opportunity.headline}"?`)) {
            this.processLaunch(opportunity);
            this.showDashboard();
        }
    }

    showEngageAutomatedCampaign(opportunity) {
        this.currentPage = 'engage-automated';
        document.getElementById('main-content').innerHTML = `
            <div class="engage-campaign-setup">
                <section class="campaign-header">
                    <nav class="breadcrumb">
                        <a href="#engage" class="breadcrumb-link">Engage</a>
                        <span class="breadcrumb-separator">></span>
                        <a href="#campaign-setup" class="breadcrumb-link">Campaign Set Up</a>
                        <span class="breadcrumb-separator">></span>
                        <span>Win Back Lost Customers</span>
                    </nav>
                    
                    <div class="campaign-setup-header">
                        <div class="campaign-steps">
                            <div class="step active">
                                <span class="step-number">1</span>
                                <span class="step-label">Set Up Campaign</span>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <span class="step-label">Review & Publish</span>
                            </div>
                        </div>
                        
                        <div class="campaign-actions">
                            <button class="btn btn-secondary">Save</button>
                            <button class="btn btn-primary">Save & Next</button>
                        </div>
                    </div>
                </section>

                <section class="campaign-setup-content">
                    <div class="campaign-setup-card">
                        <div class="campaign-type-info">
                            <div class="campaign-icon">
                                <i class="fas fa-sync-alt"></i>
                            </div>
                            <div class="campaign-description">
                                <h3>Recurring Campaign Set Up</h3>
                                <p>This is an automated campaign, SMS will be sent to eligible customer based on your pre-defined criteria.</p>
                            </div>
                        </div>
                        
                        <div class="campaign-form">
                            <div class="form-section">
                                <h4>Message</h4>
                                <div class="brand-name-field">
                                    <label>Brand Name</label>
                                    <input type="text" value="Mama Kopitiam" readonly>
                                    <small>Your Brand name will be featured at the beginning of the SMS</small>
                                </div>
                                
                                <div class="sms-content-field">
                                    <label>SMS Content</label>
                                    <div class="sms-template-selector">
                                        <button class="template-btn active">
                                            <i class="fas fa-magic"></i>
                                            Restore SMS Template
                                        </button>
                                    </div>
                                    <textarea id="sms-content" rows="4" placeholder="Hi [firstname], We miss you! Here's 10% OFF for your next visit. Show this SMS to redeem.">Hi [firstname], We miss you! Here's 10% OFF for your next visit. Show this SMS to redeem.</textarea>
                                    <div class="sms-preview">
                                        <div class="sms-preview-header">
                                            <span>SMS Preview</span>
                                        </div>
                                        <div class="sms-preview-content">
                                            <strong>RM0 - Hi Jennifer, We miss you! Here's 10% OFF for your next visit. Show this SMS to redeem.</strong>
                                        </div>
                                    </div>
                                    <div class="character-count">92/160, SMS 1</div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Attributes</h4>
                                <div class="attribute-field">
                                    <label>First name</label>
                                    <select>
                                        <option selected>First name</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Target Customers</h4>
                                <div class="target-customers-field">
                                    <label>* Last Purchase Day Between</label>
                                    <div class="date-range">
                                        <input type="number" value="21" min="1"> to 
                                        <input type="number" value="150" min="1"> days
                                        <span class="recommended">(Recommended)</span>
                                    </div>
                                    <small>SMS will be sent to all customers who last transacted within this day range</small>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Schedule</h4>
                                <div class="schedule-field">
                                    <label>* Campaign Start Date</label>
                                    <input type="date" value="2025-07-09">
                                    <small>Select your preferred start date for the campaign to go live</small>
                                </div>
                                
                                <div class="schedule-field">
                                    <label>* Send SMS at (daily basis)</label>
                                    <input type="time" value="11:00">
                                    <small>It is best to schedule sending 1-2 hours before your expected peak hours.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.setupBreadcrumbNavigation();
        this.setupEngageCampaignEvents(opportunity);
    }
    
    showEngageCustomCampaign(opportunity) {
        this.currentPage = 'engage-custom';
        document.getElementById('main-content').innerHTML = `
            <div class="engage-campaign-setup">
                <section class="campaign-header">
                    <nav class="breadcrumb">
                        <a href="#engage" class="breadcrumb-link">Engage</a>
                        <span class="breadcrumb-separator">></span>
                        <span>One-Time SMS Campaign</span>
                    </nav>
                    
                    <div class="campaign-setup-header">
                        <div class="campaign-steps">
                            <div class="step active">
                                <span class="step-number">1</span>
                                <span class="step-label">Set Up Campaign</span>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span>
                                <span class="step-label">Review & Publish</span>
                            </div>
                        </div>
                        
                        <div class="campaign-actions">
                            <button class="btn btn-secondary">Save</button>
                            <button class="btn btn-primary">Save & Next</button>
                        </div>
                    </div>
                </section>

                <section class="campaign-setup-content">
                    <div class="campaign-setup-card">
                        <div class="campaign-type-info">
                            <div class="campaign-icon">
                                <i class="fas fa-paper-plane"></i>
                            </div>
                            <div class="campaign-description">
                                <h3>One-Time SMS Campaign</h3>
                                <p>Send targeted promotional messages to boost sales of specific products or offers.</p>
                            </div>
                        </div>
                        
                        <div class="campaign-form">
                            <div class="form-section">
                                <h4>Message</h4>
                                <div class="brand-name-field">
                                    <label>Brand Name</label>
                                    <input type="text" value="Mama Kopitiam" readonly>
                                    <small>Your Brand name will be featured at the beginning of the SMS</small>
                                </div>
                                
                                <div class="sms-content-field">
                                    <label>SMS Content</label>
                                    <textarea id="sms-content" rows="4" placeholder="Enter your promotional message...">${opportunity.campaignDetails?.suggestedCopy || 'Boost your sales with our special promotion!'}</textarea>
                                    <div class="sms-preview">
                                        <div class="sms-preview-header">
                                            <span>SMS Preview</span>
                                        </div>
                                        <div class="sms-preview-content">
                                            <strong>RM0 - ${opportunity.campaignDetails?.suggestedCopy || 'Boost your sales with our special promotion!'}</strong>
                                        </div>
                                    </div>
                                    <div class="character-count">92/160, SMS 1</div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Target Customers</h4>
                                <div class="target-customers-field">
                                    <label>Campaign Audience</label>
                                    <select>
                                        <option selected>All Customers</option>
                                        <option>Frequent Customers</option>
                                        <option>New Customers</option>
                                        <option>VIP Customers</option>
                                    </select>
                                    <small>Select the customer segment for this campaign</small>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h4>Schedule</h4>
                                <div class="schedule-field">
                                    <label>* Send Date & Time</label>
                                    <input type="datetime-local" value="2025-01-15T14:00">
                                    <small>Choose when to send this campaign</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.setupBreadcrumbNavigation();
        this.setupEngageCampaignEvents(opportunity);
    }
    
    setupEngageCampaignEvents(opportunity) {
        // Save & Next button
        document.querySelector('.btn-primary').addEventListener('click', () => {
            this.confirmEngageCampaignLaunch(opportunity);
        });
        
        // Save button
        document.querySelector('.btn-secondary').addEventListener('click', () => {
            this.saveEngageCampaign(opportunity);
        });
    }
    
    confirmEngageCampaignLaunch(opportunity) {
        const smsContent = document.getElementById('sms-content')?.value || '';
        
        if (!smsContent.trim()) {
            alert('Please enter SMS content before launching the campaign.');
            return;
        }
        
        // Show confirmation dialog
        const confirmMessage = opportunity.campaignType === 'smart-segment' 
            ? `Launch automated "${opportunity.headline}" campaign?\n\nThis will create a recurring campaign that automatically targets eligible customers.`
            : `Launch one-time "${opportunity.headline}" campaign?\n\nThis will send SMS to selected customers immediately.`;
            
        if (confirm(confirmMessage)) {
            this.processLaunch(opportunity);
            this.showDashboard();
        }
    }
    
    saveEngageCampaign(opportunity) {
        // Save campaign without launching
        this.showNotification('Campaign saved successfully!', 'success');
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
} 