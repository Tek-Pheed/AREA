import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-actions-cards',
    templateUrl: 'actions_cards.components.html',
    styleUrls: ['actions_cards.components.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class ActionsCardsComponent {
    @Input() title: string = '';
    @Input() description: string = '';
    @Input() background_color: string = '#ccf1f7';
    @Input() image: string = '';
    @Input() service: string = '';
    @Input() editable: boolean = false;
    @Input() id: string = '';

    @Output() onCardClicked = new EventEmitter<string>();
    @Output() onEditClicked = new EventEmitter<string>();

    getServiceColor(): string {
        switch (this.service) {
            case 'Spotify':
                return '#009b00';
            case 'Twitch':
                return '#7452a9';
            case 'Github':
                return '#344049';
            case 'Unsplash':
                return '#737373';
            case 'Google':
                return '#96d4ff';
            case 'Discord':
                return '#6b87ff';
        }
        return this.background_color;
    }

    constructor() {}

    cardClicked() {
        this.onCardClicked.emit(this.id);
    }

    editClicked() {
        this.onEditClicked.emit(this.id);
    }
}
