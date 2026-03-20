'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function AdminReportsPage() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const reports = useQuery(api.admin.getReports, { status: statusFilter });
  const resolveReport = useMutation(api.admin.resolveReport);

  async function handleResolve(reportId: any, action: 'resolved' | 'dismissed') {
    try {
      await resolveReport({ reportId, status: action });
      toast.success(`Report ${action}`);
    } catch {
      toast.error('Action failed');
    }
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Moderation Queue</h1>
          <p className="text-muted-foreground">Review and resolve user-submitted reports</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <FilterButton active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')} label="Pending" />
          <FilterButton active={statusFilter === 'resolved'} onClick={() => setStatusFilter('resolved')} label="Resolved" />
          <FilterButton active={statusFilter === 'dismissed'} onClick={() => setStatusFilter('dismissed')} label="Dismissed" />
        </div>
      </div>

      <div className="grid gap-4">
        {reports?.map((report) => (
          <Card key={report._id} className={report.status === 'pending' ? 'border-l-4 border-l-amber-500' : ''}>
            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{report.category}</Badge>
                  <span className="text-xs text-muted-foreground italic">
                    {formatDistanceToNow(report.createdAt)} ago
                  </span>
                </div>
                <CardTitle className="text-base font-semibold">Report #{report._id.slice(-6)}</CardTitle>
              </div>
              {report.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => handleResolve(report._id, 'dismissed')}>
                    Dismiss
                  </Button>
                  <Button size="sm" className="h-8" onClick={() => handleResolve(report._id, 'resolved')}>
                    Resolve
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="text-sm p-3 bg-muted/30 rounded-lg border italic">
                "{report.reason}"
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Icon icon="solar:user-linear" className="size-3.5" />
                  <span>Reporter ID: {report.reporterId.slice(-6)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon icon="solar:user-block-linear" className="size-3.5" />
                  <span>Target ID: {report.targetId.slice(-6)}</span>
                </div>
                {report.contentId && (
                  <div className="flex items-center gap-1.5 text-primary">
                    <Icon icon="solar:document-text-linear" className="size-3.5" />
                    <span>View Content</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {reports && reports.length === 0 && (
          <div className="p-20 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl">
            <Icon icon="solar:shield-check-linear" className="size-12 mx-auto mb-4 opacity-20" />
            No reports in the "{statusFilter}" queue.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
        active ? 'bg-background shadow-sm' : 'text-muted-foreground hover:bg-muted-foreground/10'
      }`}
    >
      {label}
    </button>
  );
}
