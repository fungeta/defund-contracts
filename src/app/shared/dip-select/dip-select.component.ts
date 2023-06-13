import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DipSelectOption} from "./dip-select.model";

@Component({
    selector: 'dip-select',
    templateUrl: './dip-select.component.html',
    styleUrls: ['./dip-select.component.scss'],
    host: {
        '(document:keydown)': 'handleKeyboardEvents($event)'
    }
})
export class DipSelectComponent implements OnInit{

    @Input() options: DipSelectOption[];
    @Output() currentValueChange = new EventEmitter();

    public currentValue: DipSelectOption;
    public dropdownOpen: boolean = false;
    private currentIndex = -1;

    constructor(private elem: ElementRef) {
    }

    public get dropdownElement(): Element {
        return this.elem.nativeElement.querySelector('.dropdown-list')
    }

    ngOnInit(): void {
        this.currentValue = this.options[0];
    }

    handleKeyboardEvents($event: KeyboardEvent) {
        if (this.dropdownOpen) {
            $event.preventDefault();
        } else {
            return;
        }
        if ($event.code === 'ArrowUp') {
            if (this.currentIndex < 0) {
                this.currentIndex = 0;
            } else if (this.currentIndex > 0) {
                this.currentIndex--;
            }
            this.elem.nativeElement.querySelectorAll('li').item(this.currentIndex).focus();
        } else if ($event.code === 'ArrowDown') {
            if (this.currentIndex < 0) {
                this.currentIndex = 0;
            } else if (this.currentIndex < this.options.length - 1) {
                this.currentIndex++;
            }
            this.elem.nativeElement.querySelectorAll('li').item(this.currentIndex).focus();
        } else if (($event.code === 'Enter' || $event.code === 'NumpadEnter') && this.currentIndex >= 0) {
            this.selectByIndex(this.currentIndex);
        } else if ($event.code === 'Escape') {
            this.closeDropdown();
        }
    }

    closeDropdown() {
        this.dropdownElement.setAttribute('aria-expanded', "false");
        this.currentIndex = -1;
        this.dropdownOpen = false;
    }

    selectByIndex(i: number) {
        let value = this.options[i];
        this.select(value);
    }

    select(option: DipSelectOption) {
        this.currentValue = option;
        this.closeDropdown();
        this.currentValueChange.emit(this.currentValue);
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
        this.dropdownElement.setAttribute('aria-expanded', this.dropdownOpen ? "true" : "false");
    }

}
