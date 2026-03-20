'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';

export default function AdminAuditLogsPage() {
  const logs = useQuery(api.admin.getAuditLogs, { limit: 100 });

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Historical record of administrative and system actions</p>
      </div>

      <Card>
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px]">Staff Member</TableHead>
              <TableHead className="w-[180px]">Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-xs italic truncate">Admin #{log.actorId.slice(-6)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {log.action.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground capitalize">{log.targetType}: {log.targetId.slice(-6)}</span>
                    <pre className="text-[10px] bg-muted p-1 rounded mt-1 overflow-hidden">
                      {JSON.stringify(log.details)}
                    </pre>
                  </div>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(log.createdAt)} ago
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {logs && logs.length === 0 && (
          <div className="p-12 text-center text-muted-foreground italic">
            No audit records found.
          </div>
        )}
      </Card>
    </div>
  );
}
