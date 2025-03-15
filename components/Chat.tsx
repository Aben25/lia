'use client';

import React, { useEffect, useState } from 'react';
import {
  Chat as StreamChat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { getStreamClient, initializeStreamUser } from '@/utils/getstream';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import 'stream-chat-react/dist/css/v2/index.css';

interface ChatProps {
  userId: string;
  userName: string;
  channelId: string;
  sponsorId: string;
  sponseeId: string;
  channelName: string;
}

export const Chat: React.FC<ChatProps> = ({
  userId,
  userName,
  channelId,
  sponsorId,
  sponseeId,
  channelName,
}) => {
  const [channel, setChannel] = useState<any>(null);
  const [clientReady, setClientReady] = useState(false);
  const { toast } = useToast();
  const streamClient = getStreamClient();

  useEffect(() => {
    let mounted = true;

    const initChat = async () => {
      if (!userId || !userName || !channelId) {
        return;
      }

      try {
        // Initialize user
        await initializeStreamUser(userId, userName);

        // Create or get channel
        const channel = streamClient.channel('messaging', channelId, {
          members: [sponsorId, sponseeId],
          name: channelName,
        });

        // Watch channel
        await channel.watch();

        if (mounted) {
          setChannel(channel);
          setClientReady(true);
        }
      } catch (error: any) {
        console.error('Error initializing chat:', error);
        if (mounted) {
          toast({
            title: 'Chat Error',
            description: error.message || 'Failed to initialize chat',
            variant: 'destructive',
          });
        }
      }
    };

    initChat();

    return () => {
      mounted = false;
      streamClient.disconnectUser();
    };
  }, [
    userId,
    userName,
    channelId,
    sponsorId,
    sponseeId,
    channelName,
    streamClient,
    toast,
  ]);

  if (!clientReady || !channel) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="h-[600px]">
      <StreamChat client={streamClient} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </StreamChat>
    </div>
  );
};
