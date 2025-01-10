// generar-chat.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { GenerarChatService } from './generar-chat.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [GenerarChatService]
})
export class GenerarChatModule {}
