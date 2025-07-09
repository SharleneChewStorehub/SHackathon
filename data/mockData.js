// Mock Data for Dynamic Growth Dashboard
// Simulates the output from the AI Brain analytical service

// Merchant Information
const merchantData = {
    name: "Mama Kopitiam",
    type: "F&B",
    location: "Bangsar, Kuala Lumpur",
    establishedDate: "2019-03-15",
    averageMonthlyRevenue: 28500,
    totalCustomers: 1247,
    averageOrderValue: 12.80
};

// Current Active Opportunities (Today's Opportunities)
const currentOpportunities = [
    {
        id: "opp_001",
        category: "customer-lifecycle",
        categoryLabel: "Customer Lifecycle",
        categoryColor: "#FF6B6B",
        headline: "Win Back Your At-Risk VIP Customers",
        summary: "23 high-value customers haven't visited in 30+ days. Automated SMS campaign could recover RM3,200 monthly revenue.",
        estimatedImpact: {
            type: "revenue",
            amount: 3200,
            period: "monthly",
            confidence: 85
        },
        priority: 1,
        campaignType: "smart-segment", // automated
        createdDate: "2024-01-15T08:00:00Z",
        status: "active",
        justification: {
            narrative: "Our analysis identified 23 customers who typically spend RM45+ per visit but haven't been seen in over 30 days. These 'At-Risk VIPs' represent 12% of your revenue base. A targeted win-back campaign with a compelling offer could recover 60-70% of these customers.",
            dataPoints: [
                {
                    label: "At-Risk VIP Customers",
                    value: 23,
                    context: "Haven't visited in 30+ days"
                },
                {
                    label: "Average Spend per Customer",
                    value: "RM45.20",
                    context: "Significantly above average"
                },
                {
                    label: "Historical Win-Back Rate",
                    value: "65%",
                    context: "With targeted offers"
                },
                {
                    label: "Revenue at Risk",
                    value: "RM4,800",
                    context: "Monthly potential loss"
                }
            ],
            visualization: {
                type: "customer-matrix",
                data: {
                    segments: [
                        { name: "At-Risk VIPs", count: 23, value: 4800, color: "#FF6B6B" },
                        { name: "Regular VIPs", count: 67, value: 12400, color: "#4ECDC4" },
                        { name: "At-Risk Regulars", count: 156, value: 3200, color: "#FFE66D" },
                        { name: "Active Regulars", count: 234, value: 8100, color: "#95E1D3" }
                    ]
                }
            },
            csvData: [
                { customerId: "C001", name: "Siti Aminah", lastVisit: "2024-12-10", avgSpend: "RM52.30", totalSpend: "RM890.50" },
                { customerId: "C045", name: "Ahmad Faisal", lastVisit: "2024-12-08", avgSpend: "RM43.80", totalSpend: "RM1,205.60" },
                { customerId: "C078", name: "Lim Wei Ming", lastVisit: "2024-12-12", avgSpend: "RM48.90", totalSpend: "RM978.00" }
                // ... more customer data would be here
            ]
        },
        campaignDetails: {
            type: "smart-segment",
            segmentRule: "Lifetime Spend > RM400 AND Last Visit > 30 days",
            suggestedOffer: "25% off your favorite order + free dessert",
            suggestedCopy: "We miss you at Mama Kopitiam! Come back this week and enjoy 25% off your usual order plus complimentary dessert. Your table is waiting! 🍰",
            estimatedReach: 23,
            estimatedCost: 180
        }
    },
    {
        id: "opp_002",
        category: "product-profitability",
        categoryLabel: "Product Profitability",
        categoryColor: "#4ECDC4",
        headline: "Boost Your Most Profitable Item",
        summary: "Karipap Pusing has 78% profit margin but only 8% of sales. Strategic promotion could increase revenue by RM1,800/month.",
        estimatedImpact: {
            type: "revenue",
            amount: 1800,
            period: "monthly",
            confidence: 72
        },
        priority: 2,
        campaignType: "one-time-custom", // tactical
        createdDate: "2024-01-15T08:15:00Z",
        status: "active",
        justification: {
            narrative: "Karipap Pusing is your hidden goldmine! With a 78% profit margin, it's your most profitable item, yet it represents only 8% of total sales. A strategic promotion highlighting this signature item could significantly boost both revenue and profitability.",
            dataPoints: [
                {
                    label: "Profit Margin",
                    value: "78%",
                    context: "Highest among all items"
                },
                {
                    label: "Current Sales Share",
                    value: "8%",
                    context: "Significant untapped potential"
                },
                {
                    label: "Monthly Units Sold",
                    value: 89,
                    context: "vs 340 for Nasi Lemak"
                },
                {
                    label: "Revenue Potential",
                    value: "RM1,800",
                    context: "If promoted to 15% share"
                }
            ],
            visualization: {
                type: "profit-analysis",
                data: {
                    items: [
                        { name: "Karipap Pusing", margin: 78, sales: 8, revenue: 534 },
                        { name: "Nasi Lemak", margin: 45, sales: 35, revenue: 2890 },
                        { name: "Kopi O", margin: 65, sales: 25, revenue: 1250 },
                        { name: "Mee Goreng Mamak", margin: 52, sales: 18, revenue: 980 },
                        { name: "Teh Tarik", margin: 68, sales: 14, revenue: 756 }
                    ]
                }
            },
            csvData: [
                { item: "Karipap Pusing", unitsSold: 89, revenue: "RM534", cost: "RM117", profit: "RM417", margin: 78 },
                { item: "Nasi Lemak", unitsSold: 340, revenue: "RM2,890", cost: "RM1,590", profit: "RM1,300", margin: 45 },
                { item: "Kopi O", unitsSold: 198, revenue: "RM1,250", cost: "RM438", profit: "RM812", margin: 65 }
                // ... more product data
            ]
        },
        campaignDetails: {
            type: "one-time-custom",
            suggestedOffer: "Buy 2 Karipap Pusing, Get 1 Free + Drink Combo",
            suggestedCopy: "Try our signature Karipap Pusing at Mama Kopitiam! 🥟 This week only: Buy 2, Get 1 FREE + combo with any drink for just RM3 more. Taste the tradition!",
            estimatedReach: 450,
            estimatedCost: 120,
            duration: "7 days"
        }
    },
    {
        id: "opp_003",
        category: "basket-analysis",
        categoryLabel: "Basket Analysis",
        categoryColor: "#FFE66D",
        headline: "Increase Average Order Value",
        summary: "Customers buying Nasi Lemak rarely add drinks. Combo promotion could boost AOV by RM4.20 per order.",
        estimatedImpact: {
            type: "revenue",
            amount: 2100,
            period: "monthly",
            confidence: 68
        },
        priority: 3,
        campaignType: "one-time-custom",
        createdDate: "2024-01-15T08:30:00Z",
        status: "active",
        justification: {
            narrative: "There's a missed opportunity in your basket combinations. 73% of customers ordering Nasi Lemak don't add a drink, despite drinks having a 65% profit margin. A strategic combo offer could increase average order value significantly.",
            dataPoints: [
                {
                    label: "Nasi Lemak Orders",
                    value: 340,
                    context: "Monthly average"
                },
                {
                    label: "Orders Without Drinks",
                    value: "73%",
                    context: "248 missed opportunities"
                },
                {
                    label: "Potential AOV Increase",
                    value: "RM4.20",
                    context: "Per combo conversion"
                },
                {
                    label: "Monthly Revenue Boost",
                    value: "RM2,100",
                    context: "If 50% take combo"
                }
            ],
            visualization: {
                type: "basket-analysis",
                data: {
                    baseItem: "Nasi Lemak",
                    totalOrders: 340,
                    withDrink: 92,
                    withoutDrink: 248,
                    conversionPotential: 124,
                    revenueIncrease: 2100
                }
            },
            csvData: [
                { orderId: "O001", item: "Nasi Lemak", hasDrink: false, orderValue: "RM8.50", customer: "Regular" },
                { orderId: "O002", item: "Nasi Lemak", hasDrink: true, orderValue: "RM12.00", customer: "VIP" },
                { orderId: "O003", item: "Nasi Lemak", hasDrink: false, orderValue: "RM8.50", customer: "New" }
                // ... more order data
            ]
        },
        campaignDetails: {
            type: "one-time-custom",
            suggestedOffer: "Nasi Lemak + Drink Combo for RM11.50",
            suggestedCopy: "Perfect combo! 🍛☕ Get our signature Nasi Lemak with any hot drink for just RM11.50 (save RM1.50). Available all week!",
            estimatedReach: 340,
            estimatedCost: 85,
            duration: "7 days"
        }
    }
];

// Historical Opportunities (for Growth History page)
const historicalOpportunities = [
    {
        id: "opp_h001",
        category: "customer-lifecycle",
        categoryLabel: "Customer Lifecycle",
        categoryColor: "#FF6B6B",
        headline: "Weekend Warrior Recovery Campaign",
        summary: "Targeted weekend-only customers who stopped coming. Recovered 18 out of 32 customers.",
        estimatedImpact: {
            type: "revenue",
            amount: 2400,
            period: "monthly",
            confidence: 75
        },
        priority: 1,
        campaignType: "smart-segment",
        createdDate: "2024-01-01T09:00:00Z",
        launchedDate: "2024-01-02T14:30:00Z",
        status: "completed",
        actualResults: {
            campaignsSent: 32,
            responseRate: 56,
            revenueGenerated: 1890,
            roi: 315
        }
    },
    {
        id: "opp_h002",
        category: "product-profitability",
        categoryLabel: "Product Profitability",
        categoryColor: "#4ECDC4",
        headline: "Mee Goreng Mamak Promotion Success",
        summary: "Boosted slow-moving Mee Goreng Mamak sales by 180% with strategic pricing.",
        estimatedImpact: {
            type: "revenue",
            amount: 1200,
            period: "monthly",
            confidence: 70
        },
        priority: 2,
        campaignType: "one-time-custom",
        createdDate: "2023-12-20T10:00:00Z",
        launchedDate: "2023-12-21T16:00:00Z",
        status: "completed",
        actualResults: {
            campaignsSent: 567,
            responseRate: 23,
            revenueGenerated: 1456,
            roi: 243
        }
    },
    {
        id: "opp_h003",
        category: "inventory-aging",
        categoryLabel: "Inventory Aging",
        categoryColor: "#A8E6CF",
        headline: "Clear Slow-Moving Kuih Stock",
        summary: "Prevented RM380 in waste by promoting aging kuih inventory.",
        estimatedImpact: {
            type: "cost-saving",
            amount: 380,
            period: "one-time",
            confidence: 90
        },
        priority: 3,
        campaignType: "one-time-custom",
        createdDate: "2023-12-15T11:00:00Z",
        launchedDate: "2023-12-15T18:00:00Z",
        status: "completed",
        actualResults: {
            campaignsSent: 234,
            responseRate: 34,
            revenueGenerated: 420,
            roi: 187
        }
    }
];

// Campaign Performance Data
const campaignPerformance = {
    totalCampaigns: 12,
    totalRevenue: 18450,
    averageROI: 245,
    averageResponseRate: 31,
    topPerformingCategory: "customer-lifecycle",
    monthlyGrowth: 15
};

// Chart Data for Visualizations
const chartData = {
    customerSegmentation: {
        labels: ['At-Risk VIPs', 'Regular VIPs', 'At-Risk Regulars', 'Active Regulars'],
        data: [23, 67, 156, 234],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3']
    },
    productProfitability: {
        labels: ['Karipap Pusing', 'Nasi Lemak', 'Kopi O', 'Mee Goreng Mamak', 'Teh Tarik'],
        margins: [78, 45, 65, 52, 68],
        sales: [8, 35, 25, 18, 14],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FFA07A']
    },
    monthlyPerformance: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan'],
        revenue: [24500, 26200, 28100, 28500],
        campaigns: [2, 3, 4, 3]
    }
};

// Utility Functions
const utils = {
    formatCurrency: (amount) => `RM${amount.toLocaleString()}`,
    formatPercentage: (value) => `${value}%`,
    formatDate: (dateString) => new Date(dateString).toLocaleDateString('en-MY'),
    calculateROI: (revenue, cost) => Math.round(((revenue - cost) / cost) * 100),
    getOpportunityById: (id) => {
        return currentOpportunities.find(opp => opp.id === id) || 
               historicalOpportunities.find(opp => opp.id === id);
    },
    filterOpportunitiesByCategory: (category) => {
        if (category === 'all') return historicalOpportunities;
        return historicalOpportunities.filter(opp => opp.category === category);
    }
};

// Export all data for use in other scripts
window.mockData = {
    merchant: merchantData,
    currentOpportunities,
    historicalOpportunities,
    campaignPerformance,
    chartData,
    utils
};

// Console log for debugging
console.log('Mock data loaded successfully:', window.mockData); 