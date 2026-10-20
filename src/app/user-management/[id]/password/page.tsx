import UserPasswordForm from '../../user-password-form';

export default async function UserPasswordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserPasswordForm userId={id} />;
}
