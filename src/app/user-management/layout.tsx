import HeaderContainer from '@/components/shared/header/header-container';
import Footer from '@/components/shared/footer/page';

export default function UserManagementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderContainer />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
