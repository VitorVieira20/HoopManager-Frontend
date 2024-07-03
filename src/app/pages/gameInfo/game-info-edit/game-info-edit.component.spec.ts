import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInfoEditComponent } from './game-info-edit.component';

describe('GameInfoEditComponent', () => {
  let component: GameInfoEditComponent;
  let fixture: ComponentFixture<GameInfoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameInfoEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
