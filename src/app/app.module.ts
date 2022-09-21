import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import localeTh from '@angular/common/locales/th';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeTh, 'th');
import {DataViewModule} from 'primeng/dataview';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { PipeProjecttypeModule } from './pipe/pipe-projecttype/pipe-projecttype.module';
import { PgPoolComponent } from './pg-pool/pg-pool.component';
import { ProjectComponent } from './pg-pool/project/project.component';
import {MenubarModule} from 'primeng/menubar';
import { EmployeeComponent } from './pg-pool/employee/employee.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {MessagesModule} from 'primeng/messages';
import { EmployeeDetailComponent } from './pg-pool/employee/employee-detail/employee-detail.component';
import {InputTextModule} from 'primeng/inputtext';
import { ProjectDetailComponent } from './pg-pool/project/project-detail/project-detail.component';
import {CardModule} from 'primeng/card';
import { ImportExcelComponent } from './pg-pool/import-excel/import-excel.component';
import {BlockUIModule} from 'primeng/blockui';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {ScrollPanelModule} from 'primeng/scrollpanel'
import {ChartModule} from 'primeng/chart';
import { MessageService } from 'primeng/api';
import {ToastModule} from 'primeng/toast';
import {MessageModule} from 'primeng/message';
import {DropdownModule} from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormatDatePipe } from './pipe/format-date.pipe';
import { EditProjectComponent } from './pg-pool/edit/edit-project/edit-project.component';
import { EditEmployeeComponent } from './pg-pool/edit/edit-employee/edit-employee.component';
import {CalendarModule} from 'primeng/calendar';
import { EditEmployeeOperationComponent } from './pg-pool/edit/edit-employee-operation/edit-employee-operation.component';
import {BadgeModule} from 'primeng/badge';
import {KnobModule} from 'primeng/knob';
import {ProgressBarModule} from 'primeng/progressbar';
import { EstimationComponent } from './pg-pool/estimation/estimation.component';
import {FieldsetModule} from 'primeng/fieldset';
import {RadioButtonModule} from 'primeng/radiobutton';
import { LogInComponent } from './pg-pool/log-in/log-in/log-in.component';

@NgModule({
  declarations: [
    AppComponent,
    PgPoolComponent,
    ProjectComponent,
    EmployeeComponent,
    SidenavComponent,
    EmployeeDetailComponent,
    ProjectDetailComponent,
    ImportExcelComponent,
    FormatDatePipe,
    EditProjectComponent,
    EditEmployeeComponent,
    EditEmployeeOperationComponent,
    EstimationComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DataViewModule,
    TableModule,
    ButtonModule,
    TagModule,
    PipeProjecttypeModule,
    MenubarModule,
    InputTextModule,
    CardModule,
    BlockUIModule,
    FormsModule,
    ScrollPanelModule,
    ChartModule,
    MessagesModule,
    ReactiveFormsModule,
    ToastModule,
    MessageModule,
    DropdownModule,
    BrowserAnimationsModule,
    CalendarModule,
    BadgeModule,
    KnobModule,
    ProgressBarModule,
    FieldsetModule,
    RadioButtonModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
