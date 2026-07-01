import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AdminDashboardFiltering } from './admin-dashboard-filtering';
import { ProductService } from '../../../services/product-service'; // adjust path

type FilterObject = {
  filterBy: string;
  filterFrom: string;
  filterTo: string;
};

const cases: Array<{
  name: string;
  oldValue: FilterObject;
  newValue: FilterObject;
  shouldRequest: boolean;
}> = [
  {
    name: 'should not request when filter type changes without filter values',
    oldValue: { filterBy: '', filterFrom: '', filterTo: '' },
    newValue: { filterBy: 'price', filterFrom: '', filterTo: '' },
    shouldRequest: false,
  },
  {
    name: 'should not request when only filterFrom has a proper value',
    oldValue: { filterBy: 'price', filterFrom: '', filterTo: '' },
    newValue: { filterBy: 'price', filterFrom: '10', filterTo: '' },
    shouldRequest: false,
  },
  {
    name: 'should request when filterTo completes the range',
    oldValue: { filterBy: 'price', filterFrom: '10', filterTo: '' },
    newValue: { filterBy: 'price', filterFrom: '10', filterTo: '100' },
    shouldRequest: true,
  },
  {
    name: 'should not request when only filterFrom changes in an existing range',
    oldValue: { filterBy: 'price', filterFrom: '10', filterTo: '100' },
    newValue: { filterBy: 'price', filterFrom: '20', filterTo: '100' },
    shouldRequest: true,
  },
  {
    name: 'should request when both range values change',
    oldValue: { filterBy: 'price', filterFrom: '10', filterTo: '100' },
    newValue: { filterBy: 'price', filterFrom: '20', filterTo: '200' },
    shouldRequest: true,
  },
  {
    name: 'should request when range values are reset',
    oldValue: { filterBy: 'price', filterFrom: '10', filterTo: '100' },
    newValue: { filterBy: 'price', filterFrom: '', filterTo: '' },
    shouldRequest: true,
  },
  {
    name: 'should request when switching to stock and range values are reset',
    oldValue: { filterBy: 'price', filterFrom: '10', filterTo: '100' },
    newValue: { filterBy: 'stock', filterFrom: '', filterTo: '' },
    shouldRequest: true,
  },
];

describe('AdminDashboardFiltering', () => {
  let component: AdminDashboardFiltering;
  let fixture: ComponentFixture<AdminDashboardFiltering>;

  const productServiceMock = {
    filterProducts: vi.fn(),
  };

  beforeEach(async () => {
    productServiceMock.filterProducts.mockResolvedValue({});

    await TestBed.configureTestingModule({
      imports: [AdminDashboardFiltering],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardFiltering);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();

    productServiceMock.filterProducts.mockClear();
  });

  it.each(cases)('$name', async ({ oldValue, newValue, shouldRequest }) => {
    component.oldFilterObj.set(oldValue);

    productServiceMock.filterProducts.mockClear();

    component.filterObj.set(newValue);

    fixture.detectChanges();
    await fixture.whenStable();

    if (shouldRequest) {
      expect(productServiceMock.filterProducts).toHaveBeenCalled();
    } else {
      expect(productServiceMock.filterProducts).not.toHaveBeenCalled();
    }
  });
});