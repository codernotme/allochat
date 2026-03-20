'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';

export default function AdminPage() {
  const stats = useQuery(api.admin.getSiteStats);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">Real-time statistics and site health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers ?? '…'} 
          icon="solar:users-group-rounded-linear" 
          color="text-blue-500" 
        />
        <StatCard 
          title="Active Rooms" 
          value={stats?.totalRooms ?? '…'} 
          icon="solar:chat-round-dots-linear" 
          color="text-green-500" 
        />
        <StatCard 
          title="Total Messages" 
          value={stats?.totalMessages ?? '…'} 
          icon="solar:letter-linear" 
          color="text-purple-500" 
        />
        <StatCard 
          title="Online Now" 
          value={stats?.onlineUsers ?? '…'} 
          icon="solar:pulse-linear" 
          color="text-amber-500" 
        />
      </div>

      {/* Recent Activity (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Global Activity</CardTitle>
          <CardDescription>Visual analytics coming soon</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border-dashed border-2">
            <div className="text-center text-muted-foreground italic">
                <Icon icon="solar:chart-2-linear" className="size-12 mx-auto mb-2 opacity-20" />
                Chart visualization will be implemented in the next phase
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: any; icon: string; color: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`size-12 rounded-xl bg-muted/50 flex items-center justify-center ${color}`}>
          <Icon icon={icon} className="size-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
