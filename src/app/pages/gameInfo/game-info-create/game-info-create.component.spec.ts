import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInfoCreateComponent } from './game-info-create.component';

describe('GameInfoCreateComponent', () => {
  let component: GameInfoCreateComponent;
  let fixture: ComponentFixture<GameInfoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameInfoCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameInfoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
