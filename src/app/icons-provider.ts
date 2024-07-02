import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  HomeOutline,
  PlusOutline,
} from '@ant-design/icons-angular/icons';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  HomeOutline,
  PlusOutline,
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
