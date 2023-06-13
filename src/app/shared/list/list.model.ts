import {ComponentType} from "@angular/cdk/portal";

export interface DipListItem {
    title: string;
    secondLine?: string;
    icon?: string;
    router?: string[];
    dialogComponent?: ComponentType<any>;
    dialogData?: any;
    onClick?: (item: DipListItem) => void;
}
