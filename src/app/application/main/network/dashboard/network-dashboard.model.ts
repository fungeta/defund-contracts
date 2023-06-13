import {TableColumnDefinition} from "../../../../shared/dip-basic-table/basic-table.model";

export interface DefundSummary {
    address: string,
    name: string,
    aum: number,
    manager: string,
    network: string,
    members: number
}

export interface NetworkDashboardManagersGridItem {
    name: string,
    aum: number,
    defunds: number,
    network: string,
    members: number
}

export const DEFUNDS_COLUMNS: TableColumnDefinition[] = [
    {
        columnId: 'network-dashboard-defund-name',
        columnHeader: 'Name'
    },
    {
        columnId: 'network-dashboard-defund-aum',
        columnHeader: 'AUM'
    },
    {
        columnId: 'network-dashboard-defund-manager',
        columnHeader: 'Manager'
    },
    {
        columnId: 'network-dashboard-defund-network',
        columnHeader: 'Network'
    },
    {
        columnId: 'network-dashboard-defund-members',
        columnHeader: 'Members'
    },
    {
        columnId: 'network-dashboard-defund-join',
        columnHeader: 'Join'
    }
];

export const MANAGER_COLUMNS: TableColumnDefinition[] = [
    {
        columnId: 'network-dashboard-manager-name',
        columnHeader: 'Name'
    },
    {
        columnId: 'network-dashboard-manager-aum',
        columnHeader: 'AUM'
    },
    {
        columnId: 'network-dashboard-manager-defunds',
        columnHeader: 'Defunds'
    },
    {
        columnId: 'network-dashboard-manager-network',
        columnHeader: 'Network'
    },
    {
        columnId: 'network-dashboard-manager-members',
        columnHeader: 'Members'
    }
];

export const NO_FILTER_COLUMNS: string[] = [
    'network-dashboard-manager-network',
    'network-dashboard-defund-network',
    'network-dashboard-defund-join'
]
