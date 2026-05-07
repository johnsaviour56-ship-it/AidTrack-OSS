import { createClient } from '@/supabase/server'
import { logout } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user?.id)
    .single()

  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <span className="text-sm text-muted-foreground">
        {profile?.full_name ?? user?.email}
        {profile?.role && (
          <span className="ml-2 capitalize text-xs bg-muted px-2 py-0.5 rounded-full">
            {profile.role.replace('_', ' ')}
          </span>
        )}
      </span>
      <form action={logout}>
        <Button variant="ghost" size="sm" type="submit">
          Sign out
        </Button>
      </form>
    </header>
  )
}
