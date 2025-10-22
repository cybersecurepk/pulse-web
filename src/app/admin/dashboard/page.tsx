export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Pulse Admin Dashboard. Manage applications, batches, tests, and users.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Applications</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Batches</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Tests Completed</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">8,567</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Users</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">2,890</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
