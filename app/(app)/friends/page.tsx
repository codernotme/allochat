'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function FriendsPage() {
  const friends = useQuery(api.users.getFriends);
  const requests = useQuery(api.users.getFriendRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [findQuery, setFindQuery] = useState('');
  const searchResults = useQuery(
    api.users.searchUsers,
    findQuery.length >= 1 ? { query: findQuery } : 'skip'
  );

  const acceptRequest = useMutation(api.users.acceptFriendRequest);
  const declineRequest = useMutation(api.users.declineFriendRequest);
  const sendFriendRequest = useMutation(api.users.sendFriendRequest);

  async function handleAccept(requestId: any) {
    try {
      await acceptRequest({ requestId });
      toast.success('Friend request accepted.');
    } catch {
      toast.error('Failed to accept request.');
    }
  }

  async function handleDecline(requestId: any) {
    try {
      await declineRequest({ requestId });
      toast.success('Request declined.');
    } catch {
      toast.error('Failed to decline request.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social</h1>
          <p className="text-muted-foreground italic">Connect with friends and manage your network</p>
        </div>
        <div className="relative w-64">
           {/* Quick search input */}
           <Input 
            placeholder="Search friends..." 
            className="pl-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
           />
           <Icon icon="solar:magnifer-linear" className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
        </div>
      </div>

      <Tabs defaultValue="friends" className="flex flex-col gap-6">
        <TabsList className="bg-muted/50 w-full justify-start rounded-xl p-1 md:w-fit">
          <TabsTrigger value="friends" className="rounded-lg px-6">
            Friends {friends?.length ? <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">{friends.length}</Badge> : ''}
          </TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg px-6">
            Requests {requests?.length ? <Badge variant="secondary" className="ml-2 bg-red-100 text-red-600 dark:bg-red-900">{requests.length}</Badge> : ''}
          </TabsTrigger>
          <TabsTrigger value="find" className="rounded-lg px-6">
            <Icon icon="solar:magnifer-linear" className="size-4" />
            Find People
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="mt-0">
          <div className="grid gap-3 sm:grid-cols-2">
            {!friends && [...Array(4)].map((_, i) => <div key={i} className="bg-muted h-20 animate-pulse rounded-xl" />)}
            {friends?.length === 0 && (
              <div className="bg-muted/20 sm:col-span-2 flex flex-col items-center justify-center gap-2 rounded-2xl py-16 text-center italic">
                <Icon icon="solar:users-group-rounded-linear" className="text-muted-foreground size-10" />
                <p className="text-muted-foreground text-sm font-medium">No friends yet. Time to socialize!</p>
                <Button variant="outline" className="mt-2 text-xs">Browse Rooms</Button>
              </div>
            )}
            {friends?.map((f: any) => (
              <FriendCard key={f._id} friend={f} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-0">
          <div className="flex flex-col gap-3">
            {requests?.length === 0 && (
              <div className="bg-muted/20 border-border flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed py-12 text-center text-muted-foreground italic">
                <p className="text-sm">No pending friend requests</p>
              </div>
            )}
            {requests?.map((req: any) => (
              <div key={req._id} className="border-border bg-card flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md">
                <Avatar className="size-10 border border-primary/10 shadow-inner">
                  <AvatarFallback>
                    <Icon icon="solar:user-linear" className="size-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-foreground text-sm font-bold">User {req.requesterId.slice(0, 8)}</p>
                  <p className="text-muted-foreground text-xs italic">Sent {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAccept(req._id)} className="h-8 shadow-sm">Accept</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDecline(req._id)}>Decline</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="find" className="mt-0">
          <Card className="border-border/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Discover People</CardTitle>
              <CardDescription className="italic">Search for users by username to add them</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter @username..."
                  className="bg-background shadow-inner"
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                />
              </div>
              {searchResults && searchResults.length > 0 && (
                <div className="flex flex-col gap-2">
                  {searchResults.map((u: any) => (
                    <div key={u._id} className="border-border bg-card flex items-center gap-3 rounded-xl border p-3">
                      <Avatar className="size-10">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback>
                          <Icon icon="solar:user-linear" className="size-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{u.displayName || u.username}</p>
                        <p className="text-xs text-muted-foreground">@{u.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/profile/${u._id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Profile</Button>
                        </Link>
                        <Button size="sm" className="h-7 text-xs" onClick={async () => {
                          try {
                            await sendFriendRequest({ targetId: u._id });
                            toast.success(`Friend request sent to @${u.username}`);
                          } catch (err: any) {
                            toast.error(err.message || 'Failed');
                          }
                        }}>
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {searchResults?.length === 0 && findQuery && (
                <p className="text-muted-foreground text-center text-sm italic">No users found for "{findQuery}"</p>
              )}
              {!findQuery && (
                <p className="text-muted-foreground mt-2 text-center text-xs italic">
                  You can also find people by chatting in public rooms.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FriendCard({ friend }: { friend: any }) {
  return (
    <div className="border-border bg-card group flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="relative">
        <Avatar className="size-12 border-2 border-primary/20 shadow-inner">
          <AvatarFallback>
            <Icon icon="solar:user-circle-linear" className="size-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="bg-green-500 absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background shadow-sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate font-bold">User {friend.targetId.slice(0, 8)}</p>
        <p className="text-muted-foreground truncate text-xs italic">@{friend.targetId.slice(0, 6)}</p>
      </div>
      <Link href={`/profile/${friend.targetId}`}>
        <Button variant="ghost" size="sm" className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity">View Profile</Button>
      </Link>
    </div>
  );
}
