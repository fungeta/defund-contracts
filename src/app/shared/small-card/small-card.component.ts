import {Component, Input} from '@angular/core';

@Component({
    selector: 'dip-small-card',
    templateUrl: './small-card.component.html',
    styleUrls: ['./small-card.component.scss']
})
export class DipSmallCardComponent {

    @Input() title: string = "PUT THE TITLE!!!!!!";
    @Input() subtitle: string | undefined;
    @Input() image: string | undefined = "https://material.angular.io/assets/img/examples/shiba2.jpg";
    @Input() icon: string | undefined;

}
