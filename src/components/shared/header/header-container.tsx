
'use client';

import Header from './page';

export default function HeaderContainer() {
  return (
    <Header
      user={{
        name: 'Vipin Kumar',
        image: null,
      }}
      onMenuClick={() => {
        console.log('Toggle sidebar');
      }}
      onProfileClick={() => {
        console.log('Open profile');
      }}
      onSettingsClick={() => {
        console.log('Open settings');
      }}
      onLogout={() => {
        console.log('Logout');
      }}
    />
  );
}
