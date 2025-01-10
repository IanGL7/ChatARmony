import { TestBed } from '@angular/core/testing';

import { GenerarChatService } from './generar-chat.service';

describe('GenerarChatService', () => {
  let service: GenerarChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
