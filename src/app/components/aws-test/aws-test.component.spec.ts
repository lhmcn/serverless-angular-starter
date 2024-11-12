import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsTestComponent } from './aws-test.component';

describe('AwsTestComponent', () => {
  let component: AwsTestComponent;
  let fixture: ComponentFixture<AwsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwsTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
