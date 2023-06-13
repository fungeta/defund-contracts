import {DefundSummary, NetworkDashboardManagersGridItem} from "../../network/dashboard/network-dashboard.model";
import {TableColumnDefinition} from "../../../../shared/dip-basic-table/basic-table.model";

export interface PortfolioDefundSummary extends DefundSummary {
    balance?: number;
    performance?: number;
}

export interface PortfolioManagerSummary extends NetworkDashboardManagersGridItem {
    balance?: number;
    performance?: number;
}

export const PORTFOLIO_DASHBOARD_DEFUND_COLUMNS: TableColumnDefinition[] = [
    {
        columnId: 'portfolio-dashboard-defund-name',
        columnHeader: 'Name'
    },
    {
        columnId: 'portfolio-dashboard-defund-balance',
        columnHeader: 'Balance'
    },
    {
        columnId: 'portfolio-dashboard-defund-performance',
        columnHeader: 'Performance'
    }
]

export const PORTFOLIO_DASHBOARD_MANAGER_COLUMNS: TableColumnDefinition[] = [
    {
        columnId: 'portfolio-dashboard-manager-name',
        columnHeader: 'Name'
    },
    {
        columnId: 'portfolio-dashboard-manager-balance',
        columnHeader: 'Balance'
    },
    {
        columnId: 'portfolio-dashboard-manager-performance',
        columnHeader: 'Performance'
    }
]
