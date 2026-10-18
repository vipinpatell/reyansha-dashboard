
import UserDetails from '../userdetails';

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <UserDetails id={id} />;
}
