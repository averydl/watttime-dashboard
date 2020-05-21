import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations/src/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    styleUrls: ['app/app.component.css'],
    templateUrl: 'app/app.component.html'
})
export class AppComponent extends Component{
    @ViewChild('sidebar')
    sidebar!: SidebarComponent;
    public onCreated(args: any) {
         this.sidebar.element.style.visibility = '';
    }
}