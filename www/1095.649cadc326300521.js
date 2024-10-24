"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[1095],{4787:(x,u,s)=>{s.d(u,{y:()=>_});var e=s(4438),p=s(177);const C=a=>({"background-color":a});function g(a,m){if(1&a){const f=e.RV6();e.j41(0,"img",7),e.bIt("click",function(){e.eBV(f);const l=e.XpG();return e.Njj(l.editClicked())}),e.k0s()}}function t(a,m){if(1&a){const f=e.RV6();e.j41(0,"img",8),e.bIt("click",function(){e.eBV(f);const l=e.XpG();return e.Njj(l.deleteCard())}),e.k0s()}}let _=(()=>{var a;class m{getServiceColor(){switch(this.service){case"Spotify":return"#009b00";case"Twitch":return"#7452a9";case"Github":return"#344049";case"Unsplash":return"#737373";case"Google":return"#96d4ff";case"Discord":return"#6b87ff"}return this.background_color}constructor(){this.title="Unknown service",this.description="Please select a service",this.background_color="#919191",this.image="assets/question-mark-round-icon.svg",this.service="",this.editable=!1,this.id="",this.deletable=!1,this.onCardClicked=new e.bkB,this.onEditClicked=new e.bkB,this.onCardDeleted=new e.bkB}cardClicked(){this.onCardClicked.emit(this.id)}editClicked(){this.onEditClicked.emit(this.id)}deleteCard(){this.onCardDeleted.emit(this.id)}}return(a=m).\u0275fac=function(h){return new(h||a)},a.\u0275cmp=e.VBU({type:a,selectors:[["app-actions-cards"]],inputs:{title:"title",description:"description",background_color:"background_color",image:"image",service:"service",editable:"editable",id:"id",deletable:"deletable"},outputs:{onCardClicked:"onCardClicked",onEditClicked:"onEditClicked",onCardDeleted:"onCardDeleted"},standalone:!0,features:[e.aNF],decls:9,vars:10,consts:[[1,"card-container",3,"title","ngStyle"],["class","editImg","title","Choose another service","alt","swap icon","src","https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/arrow-goes-left-right-icon.png",3,"click",4,"ngIf"],[1,"top-row",3,"click"],["alt","service logo",1,"circle-image",3,"src"],[1,"card-title"],[1,"card-description",3,"click"],["src","https://uxwing.com/wp-content/themes/uxwing/download/user-interface/trash-icon.png","class","deleteImg","alt","delete icon","title","Delete this configuration",3,"click",4,"ngIf"],["title","Choose another service","alt","swap icon","src","https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/arrow-goes-left-right-icon.png",1,"editImg",3,"click"],["src","https://uxwing.com/wp-content/themes/uxwing/download/user-interface/trash-icon.png","alt","delete icon","title","Delete this configuration",1,"deleteImg",3,"click"]],template:function(h,l){1&h&&(e.j41(0,"div",0),e.DNE(1,g,1,0,"img",1),e.j41(2,"div",2),e.bIt("click",function(){return l.cardClicked()}),e.nrm(3,"img",3),e.j41(4,"h2",4),e.EFF(5),e.k0s()(),e.j41(6,"p",5),e.bIt("click",function(){return l.cardClicked()}),e.EFF(7),e.k0s(),e.DNE(8,t,1,0,"img",6),e.k0s()),2&h&&(e.Mz_("title","Select service ",l.title,""),e.Y8G("ngStyle",e.eq3(8,C,l.getServiceColor())),e.R7$(),e.Y8G("ngIf",1==l.editable),e.R7$(2),e.FS9("src",l.image,e.B4B),e.R7$(2),e.JRh(l.title),e.R7$(2),e.JRh(l.description),e.R7$(),e.Y8G("ngIf",l.deletable))},dependencies:[p.MD,p.bT,p.B3],styles:[".card-container[_ngcontent-%COMP%]{width:40vh;margin:10px;border-radius:30px;padding:16px;box-shadow:0 4px 8px #0000001a;box-sizing:border-box;overflow:hidden;position:relative;cursor:pointer}.editImg[_ngcontent-%COMP%]{position:absolute;width:8%;right:1.5%;border-radius:50%;top:2.5%;background-color:#fff;padding:3px}.deleteImg[_ngcontent-%COMP%]{position:absolute;width:8%;right:1.5%;top:30%;background-color:#fff;border-radius:50%;padding:3px}.top-row[_ngcontent-%COMP%]{margin:0;height:100%;display:flex;align-items:center}.circle-image[_ngcontent-%COMP%]{width:64px;height:64px;border-radius:50%;background-color:#fff;margin-right:16px;object-fit:cover;border-color:#fff;border-style:solid;border-width:2px}.card-title[_ngcontent-%COMP%]{font-size:24px;font-weight:700;margin:0;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}.card-description[_ngcontent-%COMP%]{width:100%;height:100%;padding:20px 0 0;margin:0;font-size:18px;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}.card-container[_ngcontent-%COMP%]:hover{filter:drop-shadow(0 0 .75rem rgb(136,136,136))}"]}),m})()},7246:(x,u,s)=>{s.d(u,{_:()=>C});var e=s(4438),p=s(536);let C=(()=>{var g;class t{constructor(a){this.service=a,this.profileImage="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",this.token=""}ngOnInit(){this.token=JSON.parse(JSON.stringify(localStorage.getItem("Token"))),this.service.getUserData(this.token).subscribe(a=>{""!=a.data[0].picture_url&&null!=a.data[0].picture_url&&(this.profileImage=a.data[0].picture_url)})}}return(g=t).\u0275fac=function(a){return new(a||g)(e.rXU(p.G))},g.\u0275cmp=e.VBU({type:g,selectors:[["app-navbar"]],decls:10,vars:1,consts:[[1,"container"],[1,"middleContainer"],["href","/",1,"link","para-nav","middle","title"],["href","dashboard/",1,"link","para-nav","home"],["href","dashboard/integrations",1,"link","para-nav","home"],["href","dashboard/profile",1,"img"],["alt","profile logo","title","Profile and services",3,"src"]],template:function(a,m){1&a&&(e.j41(0,"nav",0)(1,"div",1)(2,"a",2),e.EFF(3," Nexus "),e.k0s()(),e.j41(4,"a",3),e.EFF(5,"Dashboard"),e.k0s(),e.j41(6,"a",4),e.EFF(7,"Int\xe9grations"),e.k0s(),e.j41(8,"a",5),e.nrm(9,"img",6),e.k0s()()),2&a&&(e.R7$(9),e.Y8G("src",m.profileImage,e.B4B))},styles:[".container[_ngcontent-%COMP%]{display:flex;align-items:center;padding:1rem;height:65px;width:100%;background-color:#fff;margin:0% auto 0;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;border-radius:0;box-shadow:0 3px 5px gray;margin-bottom:2vh}.title[_ngcontent-%COMP%]{font-weight:bolder}.img[_ngcontent-%COMP%]{width:50px;height:50px;padding:0}.link[_ngcontent-%COMP%]{color:#000;font-size:1.3rem;border-radius:50px;padding:1rem;text-decoration:none}.link[_ngcontent-%COMP%]:hover{text-decoration:underline}.home[_ngcontent-%COMP%]{margin-left:auto}.middleContainer[_ngcontent-%COMP%]{width:100%;display:flex}.middle[_ngcontent-%COMP%]{display:flex;align-items:center}.icon[_ngcontent-%COMP%]{display:block;height:65px;width:65px;align-self:center}img[_ngcontent-%COMP%]{border-radius:50%;width:50px!important;height:50px!important;object-fit:cover}@media (prefers-color-scheme: dark){.container[_ngcontent-%COMP%]{display:flex;align-items:center;padding:1rem;height:65px;width:100%;background-color:#272727;margin:0% auto 0;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;border-radius:0;box-shadow:0 2px 5px #ffffff6e;margin-bottom:2vh}a[_ngcontent-%COMP%]{color:#fff;font-size:1.25rem;border-radius:50px;padding:1rem;text-decoration:none}a[_ngcontent-%COMP%]:hover{text-decoration:underline}}"]}),t})()},1095:(x,u,s)=>{s.r(u),s.d(u,{IntegrationsPageModule:()=>M});var e=s(177),p=s(4742),C=s(4341),g=s(8986),t=s(4438),_=s(536),a=s(3656);let m=(()=>{var n;class c{constructor(){this.action_name="",this.iconUrl="assets/icon/favicon.png"}}return(n=c).\u0275fac=function(i){return new(i||n)},n.\u0275cmp=t.VBU({type:n,selectors:[["app-actions-cards-compact"]],inputs:{action_name:"action_name",iconUrl:"iconUrl"},standalone:!0,features:[t.aNF],decls:5,vars:3,consts:[[1,"container"],["alt","actions_image",1,"iconImg",3,"src"],[1,"bgImg",3,"src"]],template:function(i,o){1&i&&(t.j41(0,"div",0),t.nrm(1,"img",1),t.j41(2,"p"),t.EFF(3),t.k0s(),t.nrm(4,"img",2),t.k0s()),2&i&&(t.R7$(),t.FS9("src",o.iconUrl,t.B4B),t.R7$(2),t.JRh(o.action_name),t.R7$(),t.FS9("src",o.iconUrl,t.B4B))},dependencies:[e.MD],styles:[".container[_ngcontent-%COMP%]{width:256px;height:256px;display:flex;position:relative;flex-direction:column;align-items:center;justify-content:center;border-radius:25px;box-shadow:0 0 10px #00000040;overflow:hidden;cursor:pointer}.container[_ngcontent-%COMP%]   .iconImg[_ngcontent-%COMP%]{width:50%;border-radius:50%;z-index:1001;border-color:#fff;border-width:2px;border-style:solid;background-color:#fff}.container[_ngcontent-%COMP%]   .bgImg[_ngcontent-%COMP%]{filter:blur(35px) saturate(3);transform:scale(3);width:100%;height:100%;position:absolute;z-index:-1000}.container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{text-align:center;font-size:30px;font-style:normal;line-height:normal;color:#fff;font-weight:bolder}.container[_ngcontent-%COMP%]:hover{filter:drop-shadow(0 0 .75rem rgb(136,136,136))}@media (prefers-color-scheme: dark){.container[_ngcontent-%COMP%]{width:256px;height:256px;display:flex;position:relative;flex-direction:column;align-items:center;justify-content:center;border-radius:25px;box-shadow:0 0 10px #00000040;overflow:hidden;cursor:pointer}.container[_ngcontent-%COMP%]   .iconImg[_ngcontent-%COMP%]{width:50%;border-radius:50%;z-index:1001;border-color:#fff;border-width:2px;border-style:solid;background-color:#fff}.container[_ngcontent-%COMP%]   .bgImg[_ngcontent-%COMP%]{filter:blur(35px) saturate(2);transform:scale(3);width:100%;height:100%;position:absolute;z-index:-1000;opacity:.6}.container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{text-align:center;font-size:30px;font-style:normal;line-height:normal;color:#fff;font-weight:bolder}.container[_ngcontent-%COMP%]:hover{filter:drop-shadow(0 0 .75rem rgb(136,136,136))}}"]}),c})();var f=s(4787),h=s(7246);function l(n,c){1&n&&t.nrm(0,"app-navbar")}function b(n,c){if(1&n){const r=t.RV6();t.j41(0,"app-actions-cards-compact",10),t.bIt("click",function(){const o=t.eBV(r).$implicit,d=t.XpG(2);return t.Njj(d.selectIntegration(o.name))}),t.k0s()}if(2&n){const r=c.$implicit;t.FS9("action_name",r.name),t.FS9("iconUrl",r.icon_url)}}function k(n,c){if(1&n&&(t.qex(0),t.j41(1,"div",3)(2,"p"),t.EFF(3,"Choose a service"),t.k0s(),t.j41(4,"div",8),t.DNE(5,b,1,2,"app-actions-cards-compact",9),t.k0s()(),t.bVm()),2&n){const r=t.XpG();t.R7$(5),t.Y8G("ngForOf",r.integrations)}}function w(n,c){if(1&n){const r=t.RV6();t.j41(0,"app-actions-cards",11),t.bIt("onCardClicked",function(){const o=t.eBV(r).$implicit,d=t.XpG();return t.Njj(d.createConfigFromActionId(o.id))}),t.k0s()}if(2&n){const r=c.$implicit,i=t.XpG();t.FS9("title",r.api_name),t.FS9("service",r.api_name),t.FS9("description",r.description),t.FS9("image",i.getimgsrc(r.api_name))}}function I(n,c){1&n&&t.nrm(0,"div",12)}const O=[{path:"",component:(()=>{var n;class c{constructor(i,o,d){this.service=i,this.platform=o,this.router=d,this.integrations=[],this.selectedIntegration="",this.actions=[],this.actionResults=[],this.inSearch=!1,this.searchText="",this.token=""}getimgsrc(i){var o;let d=null===(o=this.integrations.find(({name:v})=>v===i))||void 0===o?void 0:o.icon_url;return null==d?"assets/favicon.png":d}selectIntegration(i){this.inSearch=!0,this.searchText=i.toLowerCase(),this.actionResults=this.actions.filter(o=>o.api_name.toLowerCase().indexOf(i.toLowerCase())>-1)}createConfigFromActionId(i){this.router.navigate(["/dashboard/editor"],{queryParams:{actionID:i}})}handleInput(i){const o=i.target.value.toLowerCase();this.searchText=o,this.inSearch=o.length>0,this.actionResults=this.actions.filter(d=>d.title.toLowerCase().indexOf(o)>-1||d.api_name.toLowerCase().indexOf(o)>-1)}getAllServices(){let i=JSON.parse(JSON.stringify(localStorage.getItem("Token")));this.service.getAllServices(i).subscribe(o=>{this.integrations=o.data,this.integrations.splice(this.integrations.findIndex(d=>"nexus"==d.name.toLowerCase()),1)},o=>{console.error(o)})}getAllActions(){let i=JSON.parse(JSON.stringify(localStorage.getItem("Token")));this.service.getActions(i).subscribe(o=>{console.warn(o.data),this.actions=o.data,this.actionResults=o.data},o=>{console.error(o)})}ngOnInit(){this.token=JSON.parse(JSON.stringify(localStorage.getItem("Token"))),this.token||this.router.navigate(["/home"]),this.getAllServices(),this.getAllActions()}}return(n=c).\u0275fac=function(i){return new(i||n)(t.rXU(_.G),t.rXU(a.OD),t.rXU(g.Ix))},n.\u0275cmp=t.VBU({type:n,selectors:[["app-integration"]],decls:14,vars:6,consts:[[4,"ngIf"],[1,"container"],["placeholder","Aa","show-clear-button","always",3,"ionInput","value","debounce"],[1,"chooseClass"],[1,"integrationListSmall"],[3,"title","service","description","image","onCardClicked",4,"ngFor","ngForOf"],["class","bottom",4,"ngIf"],[1,"bottom-pad"],[1,"integrationList"],[3,"action_name","iconUrl","click",4,"ngFor","ngForOf"],[3,"click","action_name","iconUrl"],[3,"onCardClicked","title","service","description","image"],[1,"bottom"]],template:function(i,o){1&i&&(t.j41(0,"ion-content"),t.DNE(1,l,1,0,"app-navbar",0),t.j41(2,"div",1)(3,"h1"),t.EFF(4,"Select a service to create a new configuration"),t.k0s(),t.j41(5,"ion-searchbar",2),t.bIt("ionInput",function(v){return o.handleInput(v)}),t.k0s(),t.DNE(6,k,6,1,"ng-container",0),t.j41(7,"div",3)(8,"p"),t.EFF(9,"Choose an action"),t.k0s(),t.j41(10,"div",4),t.DNE(11,w,1,4,"app-actions-cards",5),t.k0s(),t.DNE(12,I,1,0,"div",6),t.k0s(),t.nrm(13,"div",7),t.k0s()()),2&i&&(t.R7$(),t.Y8G("ngIf",o.platform.is("desktop")),t.R7$(4),t.FS9("value",o.searchText),t.Y8G("debounce",500),t.R7$(),t.Y8G("ngIf",!1===o.inSearch),t.R7$(5),t.Y8G("ngForOf",o.actionResults),t.R7$(),t.Y8G("ngIf",!o.platform.is("desktop")))},dependencies:[e.Sq,e.bT,p.W9,p.S1,p.Gw,m,f.y,h._],styles:[".container[_ngcontent-%COMP%]{margin-top:constant(safe-area-inset-top)!important;margin-top:env(safe-area-inset-top)!important;width:100%;height:100%;display:flex;align-items:center;flex-direction:column}ion-searchbar[_ngcontent-%COMP%]{width:90%}h1[_ngcontent-%COMP%]{font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;font-weight:400;font-size:xx-large;text-align:center}.bottom-pad[_ngcontent-%COMP%]{margin-bottom:75px}.chooseClass[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-self:center;width:85%;font-size:x-large;font-weight:bolder}.chooseClass[_ngcontent-%COMP%]   .integrationList[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:100%;flex-wrap:wrap}.chooseClass[_ngcontent-%COMP%]   .integrationList[_ngcontent-%COMP%]   app-actions-cards-compact[_ngcontent-%COMP%]{margin:20px}.chooseClass[_ngcontent-%COMP%]   .integrationListSmall[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:100%;flex-wrap:wrap}.bottom[_ngcontent-%COMP%]{height:15vh}@media (prefers-color-scheme: dark){ion-searchbar[_ngcontent-%COMP%]{--box-shadow: 0px 1px 2px 0px #f1f1f1}}"]}),c})()}];let P=(()=>{var n;class c{}return(n=c).\u0275fac=function(i){return new(i||n)},n.\u0275mod=t.$C({type:n}),n.\u0275inj=t.G2t({imports:[g.iI.forChild(O),g.iI]}),c})(),M=(()=>{var n;class c{}return(n=c).\u0275fac=function(i){return new(i||n)},n.\u0275mod=t.$C({type:n}),n.\u0275inj=t.G2t({imports:[e.MD,C.YN,p.bv,P,m,f.y]}),c})()}}]);