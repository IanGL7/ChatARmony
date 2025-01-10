import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarChatComponent } from './generar-chat.component';

describe('GenerarChatComponent', () => {
  let component: GenerarChatComponent;
  let fixture: ComponentFixture<GenerarChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
