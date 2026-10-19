'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';

import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import Footer from '@/components/shared/footer/page';
import HeaderContainer from '@/components/shared/header/header-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createRole, deleteRole, getRoles, updateRole } from '@/lib/api/roles';
import type { Role, RoleInput } from '@/types/role';

const emptyForm: RoleInput = {
  key: '',
  name: '',
  description: '',
  permissions: [],
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to complete the request.';
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [permissionsText, setPermissionsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRoles(await getRoles());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getRoles()
      .then((loadedRoles) => {
        if (active) setRoles(loadedRoles);
      })
      .catch((requestError: unknown) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function startEditing(role: Role) {
    setEditingKey(role.key);
    setForm({
      key: role.key,
      name: role.name ?? '',
      description: role.description ?? '',
      permissions: role.permissions ?? [],
    });
    setPermissionsText((role.permissions ?? []).join(', '));
    setNotice('');
  }

  function resetForm() {
    setEditingKey(null);
    setForm(emptyForm);
    setPermissionsText('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    const input = {
      ...form,
      key: form.key.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      permissions: [...new Set(
        permissionsText.split(',').map((permission) => permission.trim()).filter(Boolean),
      )],
    };

    try {
      if (editingKey) {
        await updateRole(editingKey, {
          name: input.name,
          description: input.description,
          permissions: input.permissions,
        });
        setNotice('Role updated.');
      } else {
        await createRole(input);
        setNotice('Role created.');
      }
      resetForm();
      await loadRoles();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(role: Role) {
    if (!window.confirm(`Delete the "${role.name || role.key}" role?`)) return;

    setError('');
    setNotice('');
    try {
      await deleteRole(role.key);
      setNotice('Role deleted.');
      await loadRoles();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderContainer />
      <main className="mx-auto w-full max-w-7xl flex-1 p-6 sm:p-8">
        <Breadcrumbs />
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Role Management</h1>
              <p className="text-sm text-muted-foreground">
                Create and maintain roles and their permission keys.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => void loadRoles()} disabled={loading}>
            <RefreshCw className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-md border border-destructive/30 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mb-4 rounded-md border border-primary/30 p-3 text-sm">
            {notice}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Available roles</h2>
            {loading ? (
              <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
                <RefreshCw className="mx-auto mb-3 size-5 animate-spin" />
                Loading roles...
              </div>
            ) : roles.length === 0 ? (
              <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
                No roles were returned by the API.
              </div>
            ) : (
              roles.map((role) => (
                <article key={role.key} className="rounded-xl border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{role.name || role.key}</h3>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs">{role.key}</code>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {role.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEditing(role)}>
                        <Pencil className="mr-2 size-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="icon" aria-label={`Delete ${role.name || role.key}`} onClick={() => void handleDelete(role)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {role.permissions?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span key={permission} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                          {permission}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-muted-foreground">No permissions listed.</p>
                  )}
                </article>
              ))
            )}
          </section>

          <form onSubmit={handleSubmit} className="h-fit space-y-4 rounded-xl border bg-card p-5">
            <div>
              <h2 className="font-semibold">{editingKey ? 'Edit role' : 'Create role'}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Permission values are sent as a string array.
              </p>
            </div>
            <label className="block space-y-1.5 text-sm">
              <span>Role key</span>
              <Input
                required
                minLength={2}
                maxLength={64}
                pattern="[A-Za-z0-9_-]+"
                disabled={Boolean(editingKey)}
                value={form.key}
                onChange={(event) => setForm({ ...form, key: event.target.value })}
                placeholder="administrator"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Name</span>
              <Input required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={3}
                maxLength={500}
                className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span>Permissions</span>
              <textarea
                value={permissionsText}
                onChange={(event) => setPermissionsText(event.target.value)}
                rows={4}
                placeholder="users.read, users.write"
                className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="block text-xs text-muted-foreground">Separate permissions with commas.</span>
            </label>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                {editingKey ? 'Save changes' : 'Create role'}
              </Button>
              {editingKey && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
