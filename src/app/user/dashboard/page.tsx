export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your tests and progress.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Tests</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Due this week
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Completed Tests</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Average Score</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Completed JavaScript Fundamentals Test</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
            <span className="text-sm font-medium text-green-600">92%</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Started React Advanced Concepts Test</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
            <span className="text-sm font-medium text-blue-600">In Progress</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Completed Data Structures Test</p>
              <p className="text-xs text-muted-foreground">3 days ago</p>
            </div>
            <span className="text-sm font-medium text-gray-600">85%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
