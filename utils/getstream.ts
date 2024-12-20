import { StreamChat } from 'stream-chat';

let streamClientInstance: StreamChat | null = null;

export const getStreamClient = () => {
  if (!streamClientInstance) {
    if (!process.env.NEXT_PUBLIC_GETSTREAM_API_KEY) {
      throw new Error('GetStream API key is not configured');
    }

    streamClientInstance = new StreamChat(
      process.env.NEXT_PUBLIC_GETSTREAM_API_KEY
    );
  }
  return streamClientInstance;
};

export const initializeStreamUser = async (
  userId: string,
  userName: string
) => {
  const streamClient = getStreamClient();

  try {
    // First disconnect any existing user
    await streamClient.disconnectUser();

    // Create a user token
    const token = streamClient.createToken(userId);

    // Connect the user
    await streamClient.connectUser(
      {
        id: userId,
        name: userName,
      },
      token
    );

    return token;
  } catch (error) {
    console.error('Error connecting user to Stream:', error);
    throw error;
  }
};

export const createSponsorshipChannel = async (
  sponsorId: string,
  sponseeId: string,
  channelName: string
) => {
  const streamClient = getStreamClient();
  const channelId = `sponsorship_${sponsorId}_${sponseeId}`;

  try {
    const channel = streamClient.channel('messaging', channelId, {
      members: [sponsorId, sponseeId],
      name: channelName,
    });

    await channel.watch();
    return channel;
  } catch (error) {
    console.error('Error creating/getting sponsorship channel:', error);
    throw error;
  }
};

export const disconnectUser = async () => {
  const streamClient = getStreamClient();
  try {
    await streamClient.disconnectUser();
  } catch (error) {
    console.error('Error disconnecting user from Stream:', error);
    throw error;
  }
};
