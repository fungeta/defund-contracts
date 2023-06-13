import {Component} from '@angular/core';
import {DipSelectOption} from "../../../shared/dip-select/dip-select.model";
import {Observable, of} from "rxjs";
import {DipUtils} from "../../../shared/dip-utils";
import {MatTableDataSource} from "@angular/material/table";
import {ASSETS_AVAILABLE_TOKENS, AssetsModel} from "./assets.model";

@Component({
    selector: 'app-assets',
    templateUrl: './dip-assets.component.html',
    styleUrls: ['./dip-assets.component.scss']
})
export class DipAssetsComponent {
    networks: DipSelectOption[] = [
        {
            value: "Etherium",
            label: "Etherium",
        },
        {
            value: "Polygon",
            label: "Polygon",
        }
    ];

    utils = DipUtils;
    dataSource: MatTableDataSource<AssetsModel> = new MatTableDataSource<AssetsModel>(ASSETS_AVAILABLE_TOKENS);
    displayedColumns: string[] = [
        'assets-icon',
        'assets-name',
        'assets-price',
        'assets-marketcap',
        'assets-performance',
    ];

    constructor() {
    }



}
