import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadAPK } from './download_apk.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadAPK,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadAPKRoutingModule {}
