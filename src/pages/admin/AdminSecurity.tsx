export function AdminSecurity() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Security Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-ash-light p-6 space-y-6 max-w-3xl">
        <div>
          <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
          <p className="text-sm text-ash-muted mb-4">Add an extra layer of security to your account by enabling two-factor authentication.</p>
          <button className="bg-ash text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ash/90 transition-colors">
            Enable 2FA
          </button>
        </div>
        
        <hr className="border-ash-light" />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Password Settings</h3>
          <form className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-ash mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-ash-light rounded-md text-sm focus:outline-none focus:border-ash" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ash mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-ash-light rounded-md text-sm focus:outline-none focus:border-ash" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ash mb-1">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-ash-light rounded-md text-sm focus:outline-none focus:border-ash" />
            </div>
            <button className="bg-ash text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-ash/90 transition-colors">
              Update Password
            </button>
          </form>
        </div>

        <hr className="border-ash-light" />

        <div>
          <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-ash-light rounded-md bg-white">
              <div>
                <p className="font-medium text-sm">Mac OS • Chrome</p>
                <p className="text-xs text-ash-muted mt-1">Los Angeles, CA • Current session</p>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-ash-light rounded-md">
              <div>
                <p className="font-medium text-sm">iOS • Safari</p>
                <p className="text-xs text-ash-muted mt-1">San Francisco, CA • Last active 2 hours ago</p>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
