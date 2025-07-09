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
        // Navigation event listeners - Handle all dashboard navigation
        document.addEventListener('click', (e) => {
            // Sidebar navigation
            if (e.target.matches('.sidebar-item')) {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('href'));
            }
            
            // Breadcrumb navigation
            if (e.target.matches('.breadcrumb-link')) {
                e.preventDefault();
                this.handleNavigation(e.target.getAttribute('href'));
            }
            
            // Back to dashboard buttons
            if (e.target.matches('.back-button') || e.target.closest('.back-button')) {
                e.preventDefault();
                this.navigateToDashboard();
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
                this.navigateToDashboard();
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

    navigateToDashboard() {
        // Universal method to navigate to dashboard from any page
        this.currentPage = 'dashboard';
        
        // Update page title
        document.title = 'StoreHub Dashboard - Today\'s Opportunities';
        
        // Update sidebar active state
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
        });
        const dashboardItem = document.querySelector('[href="#dashboard"]');
        if (dashboardItem) {
            dashboardItem.classList.add('active');
        }
        
        // Reset main content to dashboard
        this.showDashboard();
    }

    showDashboard() {
        this.currentPage = 'dashboard';
        
        // Update page title
        document.title = 'StoreHub Dashboard - Today\'s Opportunities';
        
        // Reset main content to dashboard
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
                        <button class="reset-demo-btn" onclick="window.dashboardManager.resetOpportunityStates()" title="Reset all opportunity cards for demo">
                            <i class="fas fa-refresh"></i> Reset Demo
                        </button>
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
                        <div class="header-buttons">
                            <button class="nav-button growth-history-btn" id="info-button">
                                Growth History
                            </button>
                            <button class="nav-button explore-opportunities-btn" onclick="window.dashboardManager.showOpportunityOptions()">
                                Explore More Opportunities
                            </button>
                        </div>
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
        
        // Load opportunities and set up event listeners
        this.loadOpportunities();
        this.setupEventListeners();
    }

    showGrowthHistory() {
        this.currentPage = 'history';
        
        // Update page title
        document.title = 'Growth History - StoreHub Dashboard';
        
        // Replace main content with Growth History page
        document.getElementById('main-content').innerHTML = `
            <div class="history-container">
                <section class="history-header">
                    <button class="back-button" onclick="window.dashboardManager.navigateToDashboard()">
                        <i class="fas fa-arrow-left"></i>
                        Back to Dashboard
                    </button>
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
                        <select id="time-filter">
                            <option value="all">All Time</option>
                            <option value="last-month">Last Month</option>
                            <option value="last-quarter">Last Quarter</option>
                            <option value="last-year">Last Year</option>
                        </select>
                    </div>
                    
                    <div class="history-list" id="history-list">
                        <div class="loading-state">Loading growth history...</div>
                    </div>
                </section>
            </div>
        `;
        
        // Load fresh data
        this.loadGrowthHistory();
    }

    showEngagePage() {
        this.currentPage = 'engage';
        document.getElementById('main-content').innerHTML = `
            <div class="engage-overview">
                <section class="engage-header">
                    <button class="back-button" onclick="window.dashboardManager.navigateToDashboard()">
                        <i class="fas fa-arrow-left"></i>
                        Back to Dashboard
                    </button>
                    <h1>Engage Overview</h1>
                    <div class="engage-credits">
                        <div class="credits-card">
                            <div class="credits-header">
                                <h3>Available Credits</h3>
                                <button class="refresh-btn">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                            <div class="credits-main">
                                <div class="credits-number">200</div>
                                <div class="credits-breakdown">
                                    <div class="credit-row">
                                        <span class="credit-label">Purchased</span>
                                        <span class="credit-value">200</span>
                                    </div>
                                    <div class="credit-row">
                                        <span class="credit-label">Free</span>
                                        <span class="credit-value">0</span>
                                    </div>
                                </div>
                            </div>
                            <button class="topup-btn">
                                <i class="fas fa-plus"></i>
                                Top-up
                            </button>
                        </div>
                    </div>
                </section>

                <section class="automated-campaigns-section">
                    <h2>Automated Campaigns</h2>
                    <div class="campaigns-grid">
                        <div class="campaign-column">
                            <div class="campaign-category-header">
                                <h3>Welcome Message</h3>
                                <p>Reward new customers with vouchers or freebies</p>
                            </div>
                            <div class="campaign-options">
                                <div class="campaign-option">
                                    <div class="campaign-icon">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <span class="campaign-name">Welcome New Customers</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campaign-column">
                            <div class="campaign-category-header">
                                <h3>Engage Customers</h3>
                                <p>Stay top of mind with your existing customers</p>
                            </div>
                            <div class="campaign-options">
                                <div class="campaign-option active">
                                    <div class="campaign-icon">
                                        <i class="fas fa-birthday-cake"></i>
                                    </div>
                                    <span class="campaign-name">Birthday Promotion</span>
                                </div>
                                <div class="campaign-option">
                                    <div class="campaign-icon">
                                        <i class="fas fa-money-bill-wave"></i>
                                    </div>
                                    <span class="campaign-name">Cashback Reminder</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campaign-column">
                            <div class="campaign-category-header">
                                <h3>Bring Back Customers</h3>
                                <p>Remind inactive customers to return and spend again</p>
                            </div>
                            <div class="campaign-options">
                                <div class="campaign-option">
                                    <div class="campaign-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <span class="campaign-name">Expiring Cashback Alert</span>
                                </div>
                                <div class="campaign-option highlighted">
                                    <div class="campaign-icon">
                                        <i class="fas fa-user-friends"></i>
                                    </div>
                                    <span class="campaign-name">Win Back Lost Customers</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="campaign-column">
                            <div class="campaign-category-header">
                                <h3>Other</h3>
                                <p>Extra tools to get ahead of the competition</p>
                            </div>
                            <div class="campaign-options">
                                <div class="campaign-option">
                                    <div class="campaign-icon">
                                        <i class="fas fa-star"></i>
                                    </div>
                                    <span class="campaign-name">Boost Google Reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="custom-campaign-section">
                    <h2>Custom Campaign</h2>
                    <p class="section-description">Send one-time SMS campaigns to promote your new products, limited-time offers, and special promotions.</p>
                    <div class="custom-campaign-card">
                        <div class="campaign-option large">
                            <div class="campaign-icon">
                                <i class="fas fa-sms"></i>
                            </div>
                            <span class="campaign-name">One-Time SMS Campaign</span>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.setupBreadcrumbNavigation();
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
                
                // Restore opportunity states from localStorage
                this.loadOpportunityStates();
                
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
        
        // Add event listeners to cards - CRITICAL for Continue Setup buttons
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
        const isSettingUp = opportunity.status === 'setting-up';
        const impactAmount = window.mockData.utils.formatCurrency(opportunity.estimatedImpact.amount);
        const impactPeriod = opportunity.estimatedImpact.period;
        
        return `
            <div class="opportunity-card ${isLaunched ? 'launched' : ''} ${isSettingUp ? 'setting-up' : ''}" data-opportunity-id="${opportunity.id}">
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
                
                ${this.createCardActionsForState(opportunity)}
            </div>
        `;
    }

    createCardActionsForState(opportunity) {
        switch (opportunity.status) {
            case 'launched':
                return this.createLaunchedStatus(opportunity);
            case 'setting-up':
                return this.createImmediateSetupStatus(opportunity);
            default:
                return this.createCardActions(opportunity);
        }
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
                <button class="btn btn-sm btn-secondary performance-btn" data-opportunity-id="${opportunity.id}">
                    <i class="fas fa-chart-bar"></i>
                    View Performance
                </button>
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

        // Continue Setup buttons
        document.querySelectorAll('.continue-setup-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Continue Setup button clicked!');
                const opportunityId = e.target.closest('.continue-setup-btn').dataset.opportunityId;
                console.log('Opportunity ID:', opportunityId);
                const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
                console.log('Found opportunity:', opportunity);
                if (opportunity) {
                    console.log('Routing to campaign setup for:', opportunity.headline);
                    this.routeToCampaignSetup(opportunity);
                } else {
                    console.error('Opportunity not found for ID:', opportunityId);
                }
            });
        });

        // Performance buttons (for launched campaigns)
        document.querySelectorAll('.performance-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const opportunityId = e.target.closest('.performance-btn').dataset.opportunityId;
                this.showCampaignInsights(opportunityId);
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

        // FR-5.1: Immediate Visual Feedback - Card immediately shows "Setting up campaign..."
        this.showImmediateSetupState(opportunity);
        
        // Brief pause to show the setup state before routing
        setTimeout(() => {
            // Route to campaign setup immediately
            this.routeToCampaignSetup(opportunity);
        }, 500); // 0.5 seconds to show setup state
    }

    showImmediateSetupState(opportunity) {
        const card = document.querySelector(`[data-opportunity-id="${opportunity.id}"]`);
        if (card) {
            // Add immediate setup state classes
            card.classList.add('setting-up');
            
            // Update opportunity status
            opportunity.status = 'setting-up';
            
            // Replace card actions with setup state
            const actionsDiv = card.querySelector('.card-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = this.createImmediateSetupStatus(opportunity);
            }
            
            // Store the state in localStorage for persistence
            this.saveOpportunityState(opportunity);
        }
    }

    createImmediateSetupStatus(opportunity) {
        return `
            <div class="setting-up-status immediate">
                <div class="setup-indicator">
                    <i class="fas fa-cog fa-spin"></i>
                    <span>Setting up campaign...</span>
                </div>
                <button class="btn btn-sm btn-secondary continue-setup-btn" data-opportunity-id="${opportunity.id}">
                    <i class="fas fa-arrow-right"></i>
                    Continue Setup
                </button>
            </div>
        `;
    }

    // Save opportunity state to localStorage for persistence
    saveOpportunityState(opportunity) {
        const savedStates = JSON.parse(localStorage.getItem('opportunityStates') || '{}');
        savedStates[opportunity.id] = {
            status: opportunity.status,
            timestamp: Date.now()
        };
        localStorage.setItem('opportunityStates', JSON.stringify(savedStates));
    }

    // Load opportunity states from localStorage
    loadOpportunityStates() {
        const savedStates = JSON.parse(localStorage.getItem('opportunityStates') || '{}');
        this.opportunities.forEach(opportunity => {
            if (savedStates[opportunity.id]) {
                opportunity.status = savedStates[opportunity.id].status;
            }
        });
    }

    // Complete the campaign launch (called from campaign setup)
    completeCampaignLaunch(opportunityId) {
        console.log('=== COMPLETING CAMPAIGN LAUNCH ===');
        console.log('completeCampaignLaunch called for opportunity ID:', opportunityId);
        
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }

        console.log('Found opportunity:', opportunity.headline, 'Current status:', opportunity.status);

        // Update opportunity status to launched
        opportunity.status = 'launched';
        
        console.log('Updated opportunity status to:', opportunity.status);
        
        // Save the launched state
        this.saveOpportunityState(opportunity);
        console.log('Saved opportunity state to localStorage');
        
        // Update the card if we're on the dashboard
        if (this.currentPage === 'dashboard') {
            console.log('Updating card to launched state');
            this.updateCardToLaunched(opportunity);
        } else {
            console.log('Not on dashboard page, current page:', this.currentPage);
        }
        
        // Show success notification
        this.showLaunchSuccess(opportunity);
        
        // Schedule move to history after 24 hours (simulate)
        setTimeout(() => {
            this.moveToHistory(opportunity);
        }, 24 * 60 * 60 * 1000);
        
        console.log('=== CAMPAIGN LAUNCH COMPLETION DONE ===');
    }

    updateCardToLaunched(opportunity) {
        const card = document.querySelector(`[data-opportunity-id="${opportunity.id}"]`);
        if (card) {
            // Remove setup state, add launched state
            card.classList.remove('setting-up');
            card.classList.add('launched');
            
            // Replace with launched status
            const actionsDiv = card.querySelector('.card-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = this.createLaunchedStatus(opportunity);
            }
            
            // Reattach event listeners
            this.attachCardEventListeners();
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

    // Reset all opportunity cards to original state (for demo purposes)
    resetOpportunityStates() {
        console.log('Resetting all opportunity states...');
        
        // Clear localStorage
        localStorage.removeItem('opportunityStates');
        
        // Reset all opportunity statuses to 'pending'
        this.opportunities.forEach(opportunity => {
            opportunity.status = 'pending';
        });
        
        // Re-render opportunities to show original state
        this.renderOpportunities();
        
        // Show success notification
        this.showNotification('All opportunity cards reset to original state!', 'success');
        
        console.log('Opportunity states reset successfully');
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
        
        // Complete the campaign launch
        this.completeCampaignLaunch(opportunity.id);
        
        // Show success modal
        this.showCampaignLaunchSuccess(opportunity);
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
            this.showDashboard();
        }, 2000);
    }
    
    confirmOneTimeLaunch(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        // Get the campaign message from the form
        const campaignMessage = document.getElementById('campaign-message')?.value || '';
        
        if (!campaignMessage.trim()) {
            alert('Please enter a campaign message before launching.');
            return;
        }
        
        // Update campaign details
        opportunity.campaignDetails = {
            ...opportunity.campaignDetails,
            finalMessage: campaignMessage
        };
        
        // Complete the campaign launch
        this.completeCampaignLaunch(opportunity.id);
        
        // Show success modal
        this.showCampaignLaunchSuccess(opportunity);
        
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
            this.showDashboard();
        }, 2000);
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
                            <button class="btn btn-secondary" onclick="window.dashboardManager.cancelCampaignSetup('${opportunity.id}')">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                            <button class="btn btn-primary" id="complete-campaign-btn" onclick="window.dashboardManager.completeCampaignAndReturnToDashboard('${opportunity.id}')">
                                <i class="fas fa-check"></i>
                                Complete Campaign
                            </button>
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
        // Remove the problematic setupEngageCampaignEvents call
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
                            <button class="btn btn-secondary" onclick="window.dashboardManager.cancelCampaignSetup('${opportunity.id}')">
                                <i class="fas fa-times"></i>
                                Cancel
                            </button>
                            <button class="btn btn-primary" id="complete-campaign-btn" onclick="window.dashboardManager.completeCampaignAndReturnToDashboard('${opportunity.id}')">
                                <i class="fas fa-check"></i>
                                Complete Campaign
                            </button>
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
                                    <input type="datetime-local" value="2025-07-09T11:00">
                                    <small>Select when you want to send this campaign</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
        
        this.setupBreadcrumbNavigation();
        // Remove the problematic setupEngageCampaignEvents call
    }
    
    // NEW METHOD: Simple, direct campaign completion that works
    completeCampaignAndReturnToDashboard(opportunityId) {
        console.log('=== COMPLETING CAMPAIGN AND RETURNING TO DASHBOARD ===');
        console.log('Opportunity ID:', opportunityId);
        
        // Find the opportunity
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }
        
        console.log('Found opportunity:', opportunity.headline);
        
        // Update campaign details
        opportunity.campaignDetails = {
            ...opportunity.campaignDetails,
            finalMessage: 'Campaign completed successfully',
            completedAt: new Date().toISOString(),
            status: 'completed'
        };
        
        // Complete the campaign launch - this updates status to 'launched'
        this.completeCampaignLaunch(opportunityId);
        
        // Show success notification
        this.showNotification('Campaign launched successfully!', 'success');
        
        // Navigate back to dashboard
        console.log('Returning to dashboard...');
        this.showDashboard();
        
        console.log('=== CAMPAIGN COMPLETION PROCESS FINISHED ===');
    }

    // REMOVE THE PROBLEMATIC METHODS
    // Remove setupEngageCampaignEvents method entirely
    // Remove confirmEngageCampaignLaunch method entirely

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

    loadGrowthHistory() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        // Show loading state
        historyList.innerHTML = '<div class="loading-state">Loading growth history...</div>';

        // Set up filter event listeners
        const categoryFilter = document.getElementById('category-filter');
        const timeFilter = document.getElementById('time-filter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterHistoryItems();
            });
        }

        if (timeFilter) {
            timeFilter.addEventListener('change', () => {
                this.filterHistoryItems();
            });
        }

        // Simulate loading delay
        setTimeout(() => {
            const historicalData = window.mockData.historicalOpportunities;
            this.renderHistoryItems(historicalData);
        }, 500);
    }

    renderHistoryItems(opportunities) {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        if (opportunities.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>No campaign history found</h3>
                    <p>Start launching campaigns from your opportunities to see results here.</p>
                </div>
            `;
            return;
        }

        const historyHTML = opportunities.map(opportunity => {
            const successScore = this.calculateSuccessScore(opportunity);
            const successClass = this.getSuccessClass(successScore);
            const successTag = this.getSuccessTag(successScore);
            
            return `
                <div class="history-item" data-category="${opportunity.category}" data-date="${opportunity.launchedDate}">
                    <div class="history-item-header">
                        <div class="history-item-info">
                            <div class="history-item-category" style="background-color: ${opportunity.categoryColor}">
                                ${opportunity.categoryLabel}
                            </div>
                            <h3 class="history-item-title">${opportunity.headline}</h3>
                            <div class="history-item-date">
                                Launched: ${this.formatDate(opportunity.launchedDate)}
                            </div>
                        </div>
                        <div class="history-item-success">
                            <div class="success-score ${successClass}">${successScore}%</div>
                            <div class="success-tag ${successTag.class}">${successTag.text}</div>
                        </div>
                    </div>
                    
                    <div class="history-item-results">
                        <div class="result-section">
                            <h4>📊 Potential (Forecast)</h4>
                            <div class="result-metrics">
                                <div class="result-metric">
                                    <span class="result-metric-label">Target Revenue</span>
                                    <span class="result-metric-value">RM${opportunity.estimatedImpact.amount.toLocaleString()}</span>
                                </div>
                                <div class="result-metric">
                                    <span class="result-metric-label">Expected Reach</span>
                                    <span class="result-metric-value">${opportunity.actualResults.campaignsSent} customers</span>
                                </div>
                                <div class="result-metric">
                                    <span class="result-metric-label">Confidence Level</span>
                                    <span class="result-metric-value">${opportunity.estimatedImpact.confidence}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="result-section">
                            <h4>🎯 Actual (Results)</h4>
                            <div class="result-metrics">
                                <div class="result-metric">
                                    <span class="result-metric-label">Revenue Generated</span>
                                    <span class="result-metric-value ${opportunity.actualResults.revenueGenerated >= opportunity.estimatedImpact.amount ? 'positive' : 'negative'}">
                                        RM${opportunity.actualResults.revenueGenerated.toLocaleString()}
                                    </span>
                                </div>
                                <div class="result-metric">
                                    <span class="result-metric-label">Response Rate</span>
                                    <span class="result-metric-value positive">${opportunity.actualResults.responseRate}%</span>
                                </div>
                                <div class="result-metric">
                                    <span class="result-metric-label">ROI</span>
                                    <span class="result-metric-value positive">${opportunity.actualResults.roi}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="history-item-actions">
                        <a href="#" class="action-link" onclick="window.dashboardManager.viewCampaignInsights('${opportunity.id}')">
                            <i class="fas fa-chart-bar"></i>
                            View Campaign Insights
                        </a>
                        <a href="#" class="action-link" onclick="window.dashboardManager.viewOriginalAnalysis('${opportunity.id}')">
                            <i class="fas fa-search"></i>
                            View Original Analysis
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        historyList.innerHTML = historyHTML;
    }

    calculateSuccessScore(opportunity) {
        const actual = opportunity.actualResults.revenueGenerated;
        const target = opportunity.estimatedImpact.amount;
        return Math.round((actual / target) * 100);
    }

    getSuccessClass(score) {
        if (score >= 100) return 'high';
        if (score >= 70) return 'medium';
        return 'low';
    }

    getSuccessTag(score) {
        if (score >= 100) return { class: 'exceeded', text: 'GOAL EXCEEDED' };
        if (score >= 70) return { class: 'partial', text: 'PARTIAL SUCCESS' };
        return { class: 'missed', text: 'GOAL MISSED' };
    }

    filterHistoryItems() {
        const categoryFilter = document.getElementById('category-filter');
        const timeFilter = document.getElementById('time-filter');
        const historyItems = document.querySelectorAll('.history-item');

        if (!categoryFilter || !timeFilter) return;

        const selectedCategory = categoryFilter.value;
        const selectedTime = timeFilter.value;

        historyItems.forEach(item => {
            const itemCategory = item.dataset.category;
            const itemDate = new Date(item.dataset.date);
            
            let showItem = true;

            // Category filter
            if (selectedCategory !== 'all' && itemCategory !== selectedCategory) {
                showItem = false;
            }

            // Time filter
            if (selectedTime !== 'all') {
                const now = new Date();
                let cutoffDate;

                switch (selectedTime) {
                    case 'last-month':
                        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        break;
                    case 'last-quarter':
                        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                        break;
                    case 'last-year':
                        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                        break;
                    default:
                        cutoffDate = new Date(0);
                }

                if (itemDate < cutoffDate) {
                    showItem = false;
                }
            }

            item.style.display = showItem ? 'block' : 'none';
        });
    }

    viewCampaignInsights(opportunityId) {
        // Simulate navigation to campaign insights page
        this.showNotification('Navigating to Campaign Insights...', 'info');
        
        // In a real implementation, this would navigate to the Engage module
        setTimeout(() => {
            this.showNotification('Campaign Insights page would open here', 'success');
        }, 1000);
    }

    viewOriginalAnalysis(opportunityId) {
        // Find the historical opportunity
        const opportunity = window.mockData.historicalOpportunities.find(opp => opp.id === opportunityId);
        
        if (opportunity) {
            // Show a simplified version of the original analysis
            this.showNotification('Original Analysis: ' + opportunity.summary, 'info');
            
            // In a real implementation, this would show the original justification modal
            setTimeout(() => {
                this.showNotification('Original analysis modal would open here', 'success');
            }, 1000);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showOpportunityOptions() {
        this.currentPage = 'opportunity-options';
        document.getElementById('main-content').innerHTML = `
            <div class="page-container">
                <div class="page-header">
                    <button class="back-button" onclick="window.dashboardManager.showDashboard()">
                        <i class="fas fa-arrow-left"></i>
                        Back to Dashboard
                    </button>
                    <h1>Explore More Opportunities</h1>
                    <p class="page-subtitle">Discover additional growth opportunities for your business</p>
                </div>
                
                <div class="opportunity-options-filters">
                    <div class="filter-group">
                        <label for="options-category-filter">Filter by Category:</label>
                        <select id="options-category-filter" onchange="window.dashboardManager.filterOpportunityOptions()">
                            <option value="all">All Categories</option>
                            <option value="customer-lifecycle">Customer Lifecycle</option>
                            <option value="product-profitability">Product Profitability</option>
                            <option value="basket-analysis">Basket Analysis</option>
                            <option value="inventory-aging">Inventory Aging</option>
                            <option value="time-based">Time-Based Optimization</option>
                            <option value="seasonal">Seasonal Opportunities</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="options-priority-filter">Filter by Priority:</label>
                        <select id="options-priority-filter" onchange="window.dashboardManager.filterOpportunityOptions()">
                            <option value="all">All Priorities</option>
                            <option value="1">High Priority</option>
                            <option value="2">Medium Priority</option>
                            <option value="3">Low Priority</option>
                        </select>
                    </div>
                </div>
                
                <div class="opportunity-options-grid" id="opportunity-options-grid">
                    <div class="loading-state">Loading opportunities...</div>
                </div>
            </div>
        `;
        
        // Load opportunity options
        this.loadOpportunityOptions();
    }

    loadOpportunityOptions() {
        const optionsGrid = document.getElementById('opportunity-options-grid');
        if (!optionsGrid) return;

        // Show loading state
        optionsGrid.innerHTML = '<div class="loading-state">Loading opportunities...</div>';

        // Simulate loading delay
        setTimeout(() => {
            const additionalOpportunities = window.mockData.additionalOpportunities;
            this.renderOpportunityOptions(additionalOpportunities);
        }, 500);
    }

    renderOpportunityOptions(opportunities) {
        const optionsGrid = document.getElementById('opportunity-options-grid');
        if (!optionsGrid) return;

        if (opportunities.length === 0) {
            optionsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-lightbulb"></i>
                    <h3>No opportunities found</h3>
                    <p>Try adjusting your filters to see more opportunities.</p>
                </div>
            `;
            return;
        }

        const optionsHTML = opportunities.map(opportunity => `
            <div class="opportunity-option-card" data-category="${opportunity.category}" data-priority="${opportunity.priority}">
                <div class="option-header">
                    <div class="category-tag ${opportunity.category}">
                        ${opportunity.categoryLabel}
                    </div>
                    <div class="priority-badge priority-${opportunity.priority}">
                        ${opportunity.priority === 1 ? 'High' : opportunity.priority === 2 ? 'Medium' : 'Low'} Priority
                    </div>
                </div>
                
                <h3 class="option-title">${opportunity.headline}</h3>
                <p class="option-summary">${opportunity.summary}</p>
                
                <div class="option-impact">
                    <div class="impact-metric">
                        <span class="impact-label">Potential Impact:</span>
                        <span class="impact-value">RM${opportunity.estimatedImpact.amount.toLocaleString()}</span>
                    </div>
                    <div class="impact-metric">
                        <span class="impact-label">Confidence:</span>
                        <span class="impact-value">${opportunity.estimatedImpact.confidence}%</span>
                    </div>
                </div>
                
                <div class="option-actions">
                    <button class="btn btn-secondary" onclick="window.dashboardManager.viewOpportunityDetails('${opportunity.id}')">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="btn btn-primary" onclick="window.dashboardManager.activateOpportunity('${opportunity.id}')">
                        <i class="fas fa-plus"></i>
                        Add to Dashboard
                    </button>
                </div>
            </div>
        `).join('');

        optionsGrid.innerHTML = optionsHTML;
    }

    filterOpportunityOptions() {
        const categoryFilter = document.getElementById('options-category-filter');
        const priorityFilter = document.getElementById('options-priority-filter');
        const optionCards = document.querySelectorAll('.opportunity-option-card');

        if (!categoryFilter || !priorityFilter) return;

        const selectedCategory = categoryFilter.value;
        const selectedPriority = priorityFilter.value;

        optionCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardPriority = card.dataset.priority;
            
            let showCard = true;

            // Category filter
            if (selectedCategory !== 'all' && cardCategory !== selectedCategory) {
                showCard = false;
            }

            // Priority filter
            if (selectedPriority !== 'all' && cardPriority !== selectedPriority) {
                showCard = false;
            }

            card.style.display = showCard ? 'block' : 'none';
        });
    }

    viewOpportunityDetails(opportunityId) {
        // Find the opportunity in additional opportunities
        const opportunity = window.mockData.additionalOpportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) return;

        // Show a detailed modal (simplified for now)
        alert(`Opportunity Details:\n\n${opportunity.headline}\n\n${opportunity.summary}\n\nPotential Impact: RM${opportunity.estimatedImpact.amount.toLocaleString()}\nConfidence: ${opportunity.estimatedImpact.confidence}%`);
    }

    activateOpportunity(opportunityId) {
        // Find the opportunity in additional opportunities
        const opportunity = window.mockData.additionalOpportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) return;

        // Add to current opportunities (simplified - in real app would sync with backend)
        window.mockData.currentOpportunities.push({
            ...opportunity,
            status: 'active',
            createdDate: new Date().toISOString()
        });

        // Show success message
        this.showNotification(`"${opportunity.headline}" has been added to your dashboard!`, 'success');
        
        // Update the card to show it's been activated
        const card = document.querySelector(`[data-category="${opportunity.category}"][data-priority="${opportunity.priority}"]`);
        if (card) {
            const button = card.querySelector('.btn-primary');
            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> Added to Dashboard';
                button.disabled = true;
                button.classList.remove('btn-primary');
                button.classList.add('btn-success');
            }
        }
    }

    setupBreadcrumbNavigation() {
        // Set up breadcrumb navigation event listeners
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.handleNavigation(href);
            });
        });
    }

    showCampaignLaunchSuccess(opportunity) {
        // Show success notification for campaign launch
        this.showNotification(`🎉 Campaign "${opportunity.headline}" launched successfully!`, 'success');
        
        // Optional: Show a more detailed success modal (simplified for now)
        console.log('Campaign launched successfully:', opportunity.headline);
    }

    showCampaignInsights(opportunityId) {
        const opportunity = this.opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) {
            console.error('Opportunity not found:', opportunityId);
            return;
        }

        // Update current page state
        this.currentPage = 'campaign-insights';
        
        // Update page title
        document.title = `Campaign Insights - ${opportunity.headline} | StoreHub`;
        
        // Generate campaign insights HTML
        const insightsHTML = this.generateCampaignInsightsHTML(opportunity);
        
        // Update main content
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = insightsHTML;
        
        // Update sidebar active state
        this.updateSidebarActiveState('dashboard');
        
        // Setup event listeners for the insights page
        this.setupCampaignInsightsEventListeners();
    }

    generateCampaignInsightsHTML(opportunity) {
        // Generate realistic campaign performance data
        const performanceData = this.generateCampaignPerformanceData(opportunity);
        
        return `
            <div class="campaign-insights-container">
                <div class="page-header">
                    <button class="back-button" onclick="window.dashboardManager.navigateToDashboard()">
                        <i class="fas fa-arrow-left"></i>
                        Back to Dashboard
                    </button>
                    <h1>Campaign Performance</h1>
                    <p class="page-subtitle">Real-time insights for your ${opportunity.headline} campaign</p>
                </div>

                <div class="insights-summary">
                    <div class="summary-cards">
                        <div class="summary-card">
                            <div class="card-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="card-content">
                                <h3>Campaign ROI</h3>
                                <div class="metric-value">${performanceData.roi}%</div>
                                <div class="metric-change positive">
                                    <i class="fas fa-arrow-up"></i>
                                    +${performanceData.roiChange}% vs target
                                </div>
                            </div>
                        </div>

                        <div class="summary-card">
                            <div class="card-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="card-content">
                                <h3>Customers Reached</h3>
                                <div class="metric-value">${performanceData.customersReached}</div>
                                <div class="metric-change positive">
                                    <i class="fas fa-arrow-up"></i>
                                    ${performanceData.reachRate}% response rate
                                </div>
                            </div>
                        </div>

                        <div class="summary-card">
                            <div class="card-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="card-content">
                                <h3>Revenue Generated</h3>
                                <div class="metric-value">${window.mockData.utils.formatCurrency(performanceData.revenue)}</div>
                                <div class="metric-change positive">
                                    <i class="fas fa-arrow-up"></i>
                                    ${performanceData.revenueGrowth}% above target
                                </div>
                            </div>
                        </div>

                        <div class="summary-card">
                            <div class="card-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="card-content">
                                <h3>Campaign Status</h3>
                                <div class="metric-value status-active">Active</div>
                                <div class="metric-change neutral">
                                    <i class="fas fa-calendar"></i>
                                    ${performanceData.daysRunning} days running
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="insights-details">
                    <div class="insights-grid">
                        <div class="insights-card">
                            <h3>
                                <i class="fas fa-target"></i>
                                Campaign Objectives
                            </h3>
                            <div class="objective-item">
                                <span class="objective-label">Primary Goal:</span>
                                <span class="objective-value">${opportunity.headline}</span>
                            </div>
                            <div class="objective-item">
                                <span class="objective-label">Target Revenue:</span>
                                <span class="objective-value">${window.mockData.utils.formatCurrency(opportunity.estimatedImpact.amount)}</span>
                            </div>
                            <div class="objective-item">
                                <span class="objective-label">Campaign Type:</span>
                                <span class="objective-value">${opportunity.campaignType === 'smart-segment' ? 'Smart Segment (Automated)' : 'One-Time Custom'}</span>
                            </div>
                        </div>

                        <div class="insights-card">
                            <h3>
                                <i class="fas fa-chart-bar"></i>
                                Performance Metrics
                            </h3>
                            <div class="metric-row">
                                <span class="metric-label">SMS Sent:</span>
                                <span class="metric-value">${performanceData.smsSent}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Response Rate:</span>
                                <span class="metric-value">${performanceData.reachRate}%</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Conversion Rate:</span>
                                <span class="metric-value">${performanceData.conversionRate}%</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">Avg. Order Value:</span>
                                <span class="metric-value">${window.mockData.utils.formatCurrency(performanceData.avgOrderValue)}</span>
                            </div>
                        </div>

                        <div class="insights-card">
                            <h3>
                                <i class="fas fa-lightbulb"></i>
                                Key Insights
                            </h3>
                            <div class="insight-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Campaign performing ${performanceData.roiChange}% above target ROI</span>
                            </div>
                            <div class="insight-item">
                                <i class="fas fa-check-circle text-success"></i>
                                <span>Higher than expected ${performanceData.reachRate}% response rate</span>
                            </div>
                            <div class="insight-item">
                                <i class="fas fa-info-circle text-info"></i>
                                <span>Peak response times: ${performanceData.peakTimes}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="campaign-actions">
                    <button class="btn btn-primary" onclick="window.dashboardManager.optimizeCampaign('${opportunity.id}')">
                        <i class="fas fa-rocket"></i>
                        Optimize Campaign
                    </button>
                    <button class="btn btn-secondary" onclick="window.dashboardManager.duplicateCampaign('${opportunity.id}')">
                        <i class="fas fa-copy"></i>
                        Duplicate Campaign
                    </button>
                    <button class="btn btn-secondary" onclick="window.dashboardManager.viewOriginalAnalysis('${opportunity.id}')">
                        <i class="fas fa-chart-pie"></i>
                        View Original Analysis
                    </button>
                </div>
            </div>
        `;
    }

    generateCampaignPerformanceData(opportunity) {
        // Generate realistic performance data based on opportunity type
        const baseROI = 180 + Math.floor(Math.random() * 120); // 180-300% ROI
        const targetAmount = opportunity.estimatedImpact.amount;
        const actualRevenue = targetAmount * (1 + (Math.random() * 0.5 + 0.1)); // 110-160% of target
        
        return {
            roi: baseROI,
            roiChange: Math.floor(baseROI - 200), // vs 200% target
            customersReached: Math.floor(Math.random() * 50 + 30), // 30-80 customers
            reachRate: Math.floor(Math.random() * 15 + 25), // 25-40% response rate
            revenue: actualRevenue,
            revenueGrowth: Math.floor(((actualRevenue - targetAmount) / targetAmount) * 100),
            daysRunning: Math.floor(Math.random() * 7 + 1), // 1-7 days
            smsSent: Math.floor(Math.random() * 200 + 100), // 100-300 SMS
            conversionRate: Math.floor(Math.random() * 8 + 12), // 12-20% conversion
            avgOrderValue: Math.floor(Math.random() * 30 + 20), // RM 20-50
            peakTimes: ['11:00 AM - 1:00 PM', '6:00 PM - 8:00 PM'][Math.floor(Math.random() * 2)]
        };
    }

    setupCampaignInsightsEventListeners() {
        // Event listeners are set up via onclick handlers in the HTML
        // This method can be extended for additional interactive features
    }

    optimizeCampaign(opportunityId) {
        this.showNotification('Campaign optimization features coming soon!', 'info');
    }

    duplicateCampaign(opportunityId) {
        this.showNotification('Campaign duplication features coming soon!', 'info');
    }

    routeToCampaignSetup(opportunity) {
        // Route to existing Engage system based on campaign type
        switch (opportunity.campaignType) {
            case 'smart-segment':
                this.showEngageAutomatedCampaign(opportunity);
                break;
            case 'one-time-custom':
                this.showEngageCustomCampaign(opportunity);
                break;
            default:
                console.error('Unknown campaign type:', opportunity.campaignType);
                // Default to custom campaign if type is unknown
                this.showEngageCustomCampaign(opportunity);
        }
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