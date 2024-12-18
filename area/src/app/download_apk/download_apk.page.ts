import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/utils/api.services';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-profil',
    templateUrl: 'download_apk.html',
    styleUrls: ['download_apk.scss'],
})
export class DownloadAPK implements OnInit {
    constructor(private service: ApiService) {}

    ngOnInit(): void {
        location.href = `${this.service.API_URL}/api/download`;
    }
}
