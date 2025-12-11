import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const adminEmail = 'admin@givelocal.sg'
    const adminPassword = 'admin123'

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail)

    if (existingAdmin) {
      // Update password if user exists
      await supabaseAdmin.auth.admin.updateUserById(existingAdmin.id, { password: adminPassword })
      
      // Ensure admin role exists
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', existingAdmin.id)
        .eq('role', 'admin')
        .maybeSingle()

      if (!existingRole) {
        await supabaseAdmin.from('user_roles').insert({ user_id: existingAdmin.id, role: 'admin' })
      }

      // Update profile status to active
      await supabaseAdmin.from('profiles').update({ status: 'active' }).eq('id', existingAdmin.id)

      return new Response(JSON.stringify({ message: 'Admin user updated', userId: existingAdmin.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create new admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: 'Admin', role: 'admin' }
    })

    if (createError) throw createError

    return new Response(JSON.stringify({ message: 'Admin user created', userId: newUser.user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
