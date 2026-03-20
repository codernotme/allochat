'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const stats = useQuery(api.admin.getSiteStats);
  const reports = useQuery(api.admin.getReports, { status: 'pending' });
  const logs = useQuery(api.admin.getAuditLogs, { limit: 5 });

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers ?? '…', 
      icon: 'solar:users-group-rounded-linear',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Active Rooms', 
      value: stats?.totalRooms ?? '…', 
      icon: 'solar:chat-round-dots-linear',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    { 
      label: 'Total Messages', 
      value: stats?.totalMessages ?? '…', 
      icon: 'solar:letter-linear',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Online Users', 
      value: stats?.onlineUsers ?? '…', 
      icon: 'solar:globus-linear',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
  ];

  return (
    <div className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold italic tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">Real-time pulse of the AlloChat community</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-none shadow-sm bg-muted/30">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <div className="text-3xl font-black tabular-nums">{stat.value}</div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <Icon icon={stat.icon} className="size-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Moderation Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Moderation Queue</CardTitle>
                <CardDescription>Recent reports requiring attention</CardDescription>
              </div>
              <Badge variant={reports?.length ? "destructive" : "outline"} className="px-3">
                {reports?.length ?? 0} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports?.slice(0, 5).map((report) => (
                <div key={report._id} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <Icon icon="solar:danger-triangle-linear" className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase text-[10px] tracking-widest text-muted-foreground">{report.category}</p>
                      <p className="text-sm line-clamp-1">{report.reason}</p>
                    </div>
                  </div>
                  <Icon icon="solar:alt-arrow-right-linear" className="size-4 text-muted-foreground" />
                </div>
              ))}
              {(!reports || reports.length === 0) && (
                <div className="py-12 text-center text-muted-foreground italic bg-muted/20 rounded-2xl border-2 border-dashed">
                  Clear queue. Great job!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Activity */}
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Latest staff actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {logs?.map((log) => (
                <div key={log._id} className="flex gap-4">
                   <div className="relative">
                     <div className="size-2 bg-primary rounded-full mt-1.5" />
                     <div className="absolute top-4 left-1 w-px h-[calc(100%+8px)] bg-border" />
                   </div>
                   <div className="flex flex-col gap-1">
                     <p className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">
                        {log.action.replace('_', ' ')}
                     </p>
                     <p className="text-xs italic truncate max-w-[150px]">
                        Target: {log.targetType} ({log.targetId.slice(-4)})
                     </p>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
