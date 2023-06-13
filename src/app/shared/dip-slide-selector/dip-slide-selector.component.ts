import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'dip-slide-selector',
  templateUrl: './dip-slide-selector.component.html',
  styleUrls: ['./dip-slide-selector.component.scss']
})
export class DipSlideSelectorComponent {

    @Input() tabList: string[];

    @Output() tabChange = new EventEmitter<string>;

    @Input() selectedTab: string;

    checkDefundSelectorClass(selected: string): string {
        if (selected == this.selectedTab) {
            return 'defund-selector-active';
        }
        return 'defund-selector-not-active';
    }

    checkDefundSelector(selected: string): boolean {
        if (selected == this.selectedTab) {
            return true;
        }
        return false;
    }

    changeTab(tab: string) {
        this.selectedTab = tab;
        this.tabChange.emit(this.selectedTab);
    }

    getDefundDashboardTabLabel(tab: string) {
        return tab;
    }

    checkDefundSelectorColClass(tabList: string[]): string {
        switch (tabList.length) {
            case 2:
                return 'col-6';
            case 3:
                return 'col-4';
            case 4:
                return 'col-3';
            case 6:
                return 'col-2';
            default:
                return '';
        }
    }
}
