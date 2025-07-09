// Dashboard JavaScript - Opportunity Cards and Interactions

class DashboardManager {
    constructor() {
        this.currentOpportunities = [];
        this.loadingState = null;
        this.opportunitiesContainer = null;
        this.infoButton = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeElements());
        } else {
            this.initializeElements();
        }
    }
    
    initializeElements() {
        // Get DOM elements
        this.opportunitiesContainer = document.getElementById('opportunities-container');
        this.loadingState = document.getElementById('loading-state');
        this.infoButton = document.getElementById('info-button');
        
        if (!this.opportunitiesContainer) {
            console.error('Dashboard container not found');
            return;
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load opportunities
        this.loadOpportunities();
    }
    
    setupEventListeners() {
        // Info button click
        if (this.infoButton) {
            this.infoButton.addEventListener('click', () => this.showGrowthHistory());
        }
        
        // Navigation handling
        this.setupNavigation();
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateTo(href);
            });
        });
    }
    
    navigateTo(route) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Hide all containers
        document.querySelectorAll('.dashboard-container, .history-container, .campaign-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Show appropriate container and activate nav link
        switch(route) {
            case '#dashboard':
                document.querySelector('.dashboard-container').style.display = 'block';
                document.querySelector('.nav-link[href="#dashboard"]').classList.add('active');
                break;
            case '#reports':
                this.showGrowthHistory();
                break;
            case '#engage':
                // Would navigate to engage section
                alert('Engage module would be integrated here');
                break;
            case '#settings':
                // Would navigate to settings
                alert('Settings page would be integrated here');
                break;
        }
    }
    
    showGrowthHistory() {
        document.querySelectorAll('.dashboard-container, .history-container, .campaign-container').forEach(container => {
            container.style.display = 'none';
        });
        
        document.querySelector('.history-container').style.display = 'block';
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-link[href="#reports"]').classList.add('active');
        
        // Load history if not already loaded
        if (window.historyManager) {
            window.historyManager.loadHistory();
        }
    }
    
    async loadOpportunities() {
        try {
            // Show loading state
            this.showLoading();
            
            // Simulate API delay for realistic loading experience
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Get opportunities from mock data
            if (window.mockData && window.mockData.currentOpportunities) {
                this.currentOpportunities = window.mockData.currentOpportunities;
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
        
        if (!this.currentOpportunities || this.currentOpportunities.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Sort opportunities by priority
        const sortedOpportunities = [...this.currentOpportunities].sort((a, b) => a.priority - b.priority);
        
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
        const opportunity = this.currentOpportunities.find(opp => opp.id === opportunityId);
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
        const opportunity = this.currentOpportunities.find(opp => opp.id === opportunityId);
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
        opportunity.launchedDate = new Date().toISOString();
        
        // Update UI
        this.updateCardToLaunched(opportunity);
        
        // Show success message
        this.showLaunchSuccess(opportunity);
        
        // Simulate moving to history after delay
        setTimeout(() => {
            this.moveToHistory(opportunity);
        }, 24000); // 24 seconds for demo (would be 24 hours in production)
    }
    
    updateCardToLaunched(opportunity) {
        const card = document.querySelector(`[data-opportunity-id="${opportunity.id}"]`);
        if (card) {
            card.classList.add('launched');
            
            // Replace actions with launched status
            const actionsContainer = card.querySelector('.card-actions');
            if (actionsContainer) {
                actionsContainer.outerHTML = this.createLaunchedStatus(opportunity);
            }
        }
    }
    
    showLaunchSuccess(opportunity) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'launch-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: var(--success-color); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: var(--shadow-lg); z-index: 1000; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-check-circle"></i>
                <span>Campaign "${opportunity.headline}" launched successfully!</span>
                <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 1rem; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    moveToHistory(opportunity) {
        // Remove from current opportunities
        this.currentOpportunities = this.currentOpportunities.filter(opp => opp.id !== opportunity.id);
        
        // Add to historical opportunities
        if (window.mockData && window.mockData.historicalOpportunities) {
            window.mockData.historicalOpportunities.unshift(opportunity);
        }
        
        // Re-render opportunities
        this.renderOpportunities();
        
        // Show notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: var(--info-color); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: var(--shadow-lg); z-index: 1000; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-archive"></i>
                <span>Opportunity moved to Growth History</span>
                <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 1rem; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Public methods for external access
    refreshOpportunities() {
        this.loadOpportunities();
    }
    
    getOpportunityById(id) {
        return this.currentOpportunities.find(opp => opp.id === id);
    }
}

// Initialize dashboard when script loads
window.dashboardManager = new DashboardManager();

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardManager;
} 