import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';

@Component({
    selector: 'app-profil',
    templateUrl: 'download_apk.html',
    styleUrls: [],
})
export class DownloadAPK implements OnInit {
    constructor(private service: ApiService) {}

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}
