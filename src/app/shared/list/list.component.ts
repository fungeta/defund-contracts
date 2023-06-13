import {Component, Input} from '@angular/core';
import {DipListItem} from "./list.model";
import {Router} from "@angular/router";

@Component({
    selector: 'dip-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class DipListComponent {

    @Input() list: DipListItem[] = [];

    constructor(private router: Router) {
    }

    navigate(item: DipListItem) {
        if (item.router) {
            this.router.navigate(item.router);
        }
    }

    onItemClick(item: DipListItem) {
        if (item.onClick) {
            item.onClick(item);
        }
    }
}
