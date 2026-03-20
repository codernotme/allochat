'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export default function AdminContentFilterPage() {
  const filters = useQuery(api.admin.getFilters);
  const addFilter = useMutation(api.admin.addFilter);
  const deleteFilter = useMutation(api.admin.deleteFilter);

  const [newPattern, setNewPattern] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd() {
    if (!newPattern.trim()) return;
    setSubmitting(true);
    try {
      await addFilter({ 
        pattern: newPattern, 
        type: 'word', 
        action: 'mask', 
        severity: 'medium' 
      });
      setNewPattern('');
      toast.success('Filter added');
    } catch {
      toast.error('Failed to add filter');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: any) {
    try {
      await deleteFilter({ filterId: id });
      toast.success('Filter removed');
    } catch {
      toast.error('Failed to remove filter');
    }
  }

  return (
    <div className="p-8 flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Content Filter</h1>
        <p className="text-muted-foreground">Define patterns and words to be masked or blocked in chat</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Filter</CardTitle>
          <CardDescription>Enter a word or regex pattern to blacklist</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            placeholder="e.g. badword or [a-z]foo" 
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={submitting}>
            {submitting ? 'Adding…' : 'Add Pattern'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Active Filters
          <Badge variant="secondary">{filters?.length ?? 0}</Badge>
        </h2>
        <div className="flex flex-wrap gap-2">
          {filters?.map((filter) => (
            <Badge key={filter._id} variant="outline" className="pl-3 pr-1 py-1 text-sm bg-muted/30 group hover:border-destructive transition-colors">
              {filter.pattern}
              <button 
                onClick={() => handleDelete(filter._id)}
                className="ml-2 p-1 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Icon icon="solar:close-circle-linear" className="size-3.5" />
              </button>
            </Badge>
          ))}
          {filters && filters.length === 0 && (
            <p className="text-sm text-muted-foreground italic p-4 border rounded-xl w-full text-center">
              No filters defined yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
