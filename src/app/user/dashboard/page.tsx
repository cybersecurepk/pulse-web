<<<<<<< HEAD
export default function UserDashboard() {
  return (
    <div className="space-y-6 bg-[#F9FAFB] min-h-screen p-6 text-[#111827]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1E40AF]">
          My Dashboard
        </h1>
        <p className="text-sm text-[#4B5563]">
          Welcome back! Here is an overview of your tests and progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Tests */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm p-6 hover:shadow-md transition">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-[#1E40AF]">
              Active Tests
            </h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#111827]">3</div>
            <p className="text-xs text-[#6B7280]">Due this week</p>
          </div>
        </div>

        {/* Completed Tests */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm p-6 hover:shadow-md transition">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-[#1E40AF]">
              Completed Tests
            </h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#111827]">12</div>
            <p className="text-xs text-[#6B7280]">This month</p>
          </div>
        </div>

        {/* Average Score */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm p-6 hover:shadow-md transition">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-[#1E40AF]">
              Average Score
            </h3>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#111827]">87%</div>
            <p className="text-xs text-[#10B981] font-medium">
              +2% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-[#1E40AF]">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">
                Completed JavaScript Fundamentals Test
              </p>
              <p className="text-xs text-[#6B7280]">2 hours ago</p>
            </div>
            <span className="text-sm font-medium text-[#10B981]">92%</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">
                Started React Advanced Concepts Test
              </p>
              <p className="text-xs text-[#6B7280]">1 day ago</p>
            </div>
            <span className="text-sm font-medium text-[#3B82F6]">
              In Progress
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-[#9CA3AF] rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#111827]">
                Completed Data Structures Test
              </p>
              <p className="text-xs text-[#6B7280]">3 days ago</p>
            </div>
            <span className="text-sm font-medium text-[#6B7280]">85%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
import { UserDashboardView } from "@/feature/user/dashboard/view";

export const metadata = { title: `Dashboard` };

export default function Page() {
  return <UserDashboardView />;
}
>>>>>>> origin/main
